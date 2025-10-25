import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { User } from 'src/auth/decorator/user.decorator';
import { Role } from 'src/auth/decorator/role.decorator';
import { UserRole } from 'src/typeorm/entities/user/user.entity';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { PaginationQueryDto } from 'src/helper/dto/pagination-query.dto';
import { BookingOptionsQueryDto } from 'src/helper/dto/booking-options-query.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Role(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @Get('all')
  findAll(
    @Query() pagination: PaginationQueryDto,
    @Query() bookingOptions: BookingOptionsQueryDto,
  ) {
    return this.bookingService.findAll(pagination, bookingOptions);
  }

  @Role(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @Get('one/:id')
  async findOne(@Param('id', ParseUUIDPipe) bookingId: string) {
    const booking = await this.bookingService.findById(bookingId);
    return { booking };
  }

  @Role(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @Post(':id/status')
  @HttpCode(HttpStatus.OK)
  updateStatus(
    @Param('id', ParseUUIDPipe) bookingId: string,
    @Body() dto: UpdateBookingStatusDto,
  ) {
    return this.bookingService.updateStatus(bookingId, dto.status);
  }

  @Post()
  create(@User('sub') userId: string, @Body() dto: CreateBookingDto) {
    return this.bookingService.create(userId, dto);
  }

  @Get()
  findAllForCurrentUser(
    @User('sub') userId: string,
    @Query() pagination: PaginationQueryDto,
    @Query() bookingOptions: BookingOptionsQueryDto,
  ) {
    return this.bookingService.findAll(pagination, bookingOptions, {
      user: { id: userId },
    });
  }

  @Get(':id')
  async findOneForCurrentUser(
    @User('sub') userId: string,
    @Param('id', ParseUUIDPipe) bookingId: string,
  ) {
    const booking = await this.bookingService.findOne(userId, bookingId);
    return { booking };
  }

  @Patch(':id')
  update(
    @User('sub') userId: string,
    @Param('id', ParseUUIDPipe) bookingId: string,
    @Body() dto: UpdateBookingDto,
  ) {
    return this.bookingService.update(userId, bookingId, dto);
  }

  @Delete(':id')
  cancel(
    @User('sub') userId: string,
    @Param('id', ParseUUIDPipe) bookingId: string,
  ) {
    return this.bookingService.cancel(userId, bookingId);
  }
}
