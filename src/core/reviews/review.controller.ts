import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { User } from 'src/decorator/user.decorator';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { OptionsQueryDto } from 'src/dto/options-query.dto';

@UseGuards(AuthGuard)
@Controller('reviews')
export class ReviewController {
  constructor(private readonly ReviewService: ReviewService) {}

  @Post()
  create(@User('sub') userId: string, @Body() dto: CreateReviewDto) {
    return this.ReviewService.create(userId, dto);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationQueryDto,
    @Query() options: OptionsQueryDto,
    @User('sub') userId: string,
  ) {
    return this.ReviewService.findAll(
      pagination,
      options,
      {
        user: { id: userId },
      },
      {
        service: true,
      },
    );
  }

  @Get(':id')
  findOne(
    @User('sub') userId: string,
    @Param('id', ParseUUIDPipe) reviewId: string,
  ) {
    return this.ReviewService.findOne(userId, reviewId);
  }

  @Patch(':id')
  update(
    @User('sub') userId: string,
    @Param('id', ParseUUIDPipe) reviewId: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.ReviewService.update(userId, reviewId, dto);
  }

  @Delete(':id')
  remove(
    @User('sub') userId: string,
    @Param('id', ParseUUIDPipe) reviewId: string,
  ) {
    return this.ReviewService.remove(userId, reviewId);
  }
}
