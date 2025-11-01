import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceService } from '../service/service.service';
import { UtilsService } from '../utils/utils.service';
import { BookingStatus } from '../booking/entities/booking.entity';
import { UpdateRatingStatus } from 'src/types/rating.types';
import {
  TypeOrmFindOptionsRelations,
  TypeOrmFindOptionsWhere,
} from 'src/types/typeorm-find-options.types';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { OptionsQueryDto } from 'src/dto/options-query.dto';
import { Service } from '../service/entities/service.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private reviewRepository: Repository<Review>,
    private serviceService: ServiceService,
    private utilsService: UtilsService,
  ) {}

  async create(userId: string, dto: CreateReviewDto) {
    const isReviewExists = await this.reviewRepository.findOne({
      where: {
        booking: { id: dto.bookingId },
      },
    });
    if (isReviewExists) {
      throw new NotFoundException('review already exists');
    }

    let service: Service;
    try {
      service = await this.serviceService.findOneBy({
        id: dto.serviceId,
        isActive: true,
        bookings: {
          id: dto.bookingId,
          status: BookingStatus.COMPLETED,
          user: {
            id: userId,
          },
        },
      });
    } catch {
      throw new NotFoundException('invalid service or booking');
    }

    const review = await this.reviewRepository.save({
      ...dto,
      service,
      user: { id: userId },
      booking: { id: dto.bookingId, isReviewed: true },
    });

    await this.serviceService.updateRating(
      service,
      review.rating,
      UpdateRatingStatus.NEW,
    );

    return { review };
  }

  async findAll(
    inPagination: PaginationQueryDto,
    inOptions: OptionsQueryDto,
    inCondition?: TypeOrmFindOptionsWhere<Review>,
    inRelation?: TypeOrmFindOptionsRelations<Review>,
  ) {
    const { page, limit, offset } = this.utilsService.getPaginationParams(
      inPagination.page,
      inPagination.limit,
    );

    const where = {};
    if (inCondition) {
      Object.assign(where, inCondition);
    }

    const [reviews, total] = await this.reviewRepository.findAndCount({
      where,
      relations: inRelation,
      skip: offset,
      take: limit,
      order: {
        [inOptions.orderBy]: inOptions.orderDirection,
      },
    });

    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };

    return { pagination, reviews };
  }

  async findOneBy(findOptions: TypeOrmFindOptionsWhere<Review>) {
    const review = await this.reviewRepository.findOne({
      where: findOptions,
      relations: {
        service: true,
      },
    });
    if (!review) {
      throw new NotFoundException('review not found');
    }
    return review;
  }

  async findOne(userId: string, serviceId: string) {
    const review = await this.reviewRepository.findOne({
      where: { id: serviceId, user: { id: userId } },
      relations: {
        user: true,
        service: true,
        booking: true,
      },
    });
    if (!review) {
      throw new NotFoundException('review not found');
    }
    return { review };
  }

  async update(userId: string, reviewId: string, dto: UpdateReviewDto) {
    const review = await this.findOneBy({ id: reviewId, user: { id: userId } });
    if (dto.rating) {
      const newRating = dto.rating - review.rating;
      await this.serviceService.updateRating(
        review.service,
        newRating,
        UpdateRatingStatus.EDIT,
      );
    }
    await this.reviewRepository.update(reviewId, dto);
    return { message: 'review updated successfully' };
  }

  async remove(userId: string, reviewId: string) {
    const review = await this.findOneBy({ id: reviewId, user: { id: userId } });
    await this.reviewRepository.delete(reviewId);
    await this.serviceService.updateRating(
      review.service,
      review.rating,
      UpdateRatingStatus.DELETE,
    );
    return { message: 'review deleted successfully' };
  }
}
