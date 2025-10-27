import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Booking,
  BookingStatus,
} from 'src/core/booking/entities/booking.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { UtilsService } from 'src/core/utils/utils.service';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { ServiceService } from 'src/core/service/service.service';
import { UserService } from 'src/core/user/user.service';
import { CarService } from 'src/core/car/car.service';
import { AddressService } from 'src/core/address/address.service';
import { BookingOptionsQueryDto } from 'src/core/booking/dto/booking-options-query.dto';
import { BookingDetail } from './entities/booking-detail.entity';
import { requiredCategoryStatus } from '../service/entities/service.entity';
import { ComponentService } from '../component/component.service';
import { ComponentCategoryService } from '../component-category/component-category.service';
import { TypeOrmFindOptionsWhere } from 'src/types/typeorm-find-options.types';
import { Address } from '../address/entities/address.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    private userService: UserService,
    private serviceService: ServiceService,
    private carService: CarService,
    private addressService: AddressService,
    private componentService: ComponentService,
    private componentCategoryService: ComponentCategoryService,
    private utilsService: UtilsService,
  ) {}

  isValidComponentsAndServiceCategories(
    componentsCategories: string[],
    serviceCategories: string[],
    status: requiredCategoryStatus,
  ) {
    const compSet = new Set(componentsCategories);
    const servSet = new Set(serviceCategories);

    if (
      compSet.size !== servSet.size &&
      status === requiredCategoryStatus.EQUAL
    ) {
      return false;
    }

    for (const comp of compSet) {
      if (!servSet.has(comp)) {
        return false;
      }
    }

    return true;
  }

  async create(userId: string, dto: CreateBookingDto) {
    const user = await this.userService.findOneBy({ id: userId });
    const service = await this.serviceService.findOneBy({
      id: dto.serviceId,
      isActive: true,
    });

    if (new Date(dto.scheduledDate) < new Date()) {
      throw new BadRequestException('invalid scheduled date');
    }

    const { address } = await this.addressService.findOne(
      userId,
      dto.addressId,
    );
    const { car } = await this.carService.findOne(userId, dto.carId);

    const serviceCategories = await this.componentCategoryService.findAll({
      services: { id: service.id },
    });
    const serviceCategoriesIds = serviceCategories.categories.map(
      (category) => category.id,
    );

    const componentsDetails: BookingDetail[] = [];
    let componentsPrice = 0;

    if (dto.components) {
      if (serviceCategoriesIds.length === 0) {
        throw new BadRequestException('invalid components');
      }

      const validComponentsCarTypes =
        await this.componentService.findForBookingByCarType(
          dto.components,
          car.type.id,
        );
      if (validComponentsCarTypes.length !== dto.components.length) {
        throw new BadRequestException('invalid components car types');
      }

      const componentsCategoriesIds = validComponentsCarTypes.map(
        (component) => component.category.id,
      );

      const isValidComponentServiceCategories =
        this.isValidComponentsAndServiceCategories(
          componentsCategoriesIds,
          serviceCategoriesIds,
          service.requiredCategoryStatus,
        );
      if (!isValidComponentServiceCategories) {
        throw new BadRequestException('invalid components categories');
      }

      validComponentsCarTypes.forEach((component) => {
        const componentDetail = new BookingDetail();
        componentDetail.component = component;

        componentsDetails.push(componentDetail);
        componentsPrice += component.price;
      });
    } else {
      if (serviceCategoriesIds.length > 0) {
        throw new BadRequestException('missing components');
      }
    }

    const booking = await this.bookingRepository.save({
      ...dto,
      user,
      service,
      car,
      address,
      details: componentsDetails,
      totalPrice: service.basePrice + componentsPrice,
    });

    return { booking };
  }

  async findAll(
    inPagination: PaginationQueryDto,
    inBookingOptions: BookingOptionsQueryDto,
    inCondition?: any,
  ) {
    const { page, limit, offset } = this.utilsService.getPaginationParams(
      inPagination.page,
      inPagination.limit,
    );

    const where = {};
    if (inCondition) {
      Object.assign(where, inCondition);
    }
    if (inBookingOptions.userId) {
      where['user'] = { id: inBookingOptions.userId };
    }
    if (inBookingOptions.status) {
      where['status'] = inBookingOptions.status;
    }

    const { startDate, endDate } = inBookingOptions;
    if (startDate && endDate) {
      where['scheduledDate'] = Between(startDate, endDate);
    } else if (startDate) {
      where['scheduledDate'] = MoreThanOrEqual(startDate);
    } else if (endDate) {
      where['scheduledDate'] = LessThanOrEqual(endDate);
    }

    const [bookings, total] = await this.bookingRepository.findAndCount({
      where,
      relations: {
        service: true,
      },
      skip: offset,
      take: limit,
      order: {
        [inBookingOptions.orderBy]: inBookingOptions.orderDirection,
      },
    });

    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };

    return { pagination, bookings };
  }

  async findOneBy(findOptions: TypeOrmFindOptionsWhere<Booking>) {
    const booking = await this.bookingRepository.findOneBy(findOptions);
    if (!booking) {
      throw new NotFoundException('booking not found');
    }
    return booking;
  }

  async findOneByWithDetails(findOptions: TypeOrmFindOptionsWhere<Booking>) {
    const booking = await this.bookingRepository.findOne({
      where: findOptions,
      relations: {
        user: true,
        service: true,
        car: true,
        address: true,
        details: {
          component: {
            category: true,
          },
        },
      },
    });
    if (!booking) {
      throw new NotFoundException('booking not found');
    }
    return { booking };
  }

  async update(userId: string, bookingId: string, dto: UpdateBookingDto) {
    if (dto.scheduledDate && new Date(dto.scheduledDate) < new Date()) {
      throw new BadRequestException('invalid scheduled date');
    }

    await this.findOneBy({
      id: bookingId,
      user: { id: userId },
    });

    let address: Address | undefined;
    if (dto.addressId) {
      address = (await this.addressService.findOne(userId, dto.addressId))
        .address;
      delete dto.addressId;
    }

    await this.bookingRepository.update(bookingId, {
      ...dto,
      address,
    });

    return { message: 'booking updated successfully' };
  }

  async updateStatus(bookingId: string, status: BookingStatus) {
    await this.findOneBy({ id: bookingId });
    await this.bookingRepository.update(bookingId, { status });
    return { message: 'booking status updated successfully' };
  }

  async cancel(userId: string, bookingId: string) {
    await this.findOneBy({ id: bookingId, user: { id: userId } });
    await this.bookingRepository.update(bookingId, {
      status: BookingStatus.CANCELLED,
    });
    return { message: 'booking cancelled successfully' };
  }
}
