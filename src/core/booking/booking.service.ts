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
} from 'src/typeorm/entities/booking/booking.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { UtilsService } from 'src/core/utils/utils.service';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { ServiceService } from 'src/core/service/service.service';
import { UserService } from 'src/core/user/user.service';
import { CarService } from 'src/core/car/car.service';
import { AddressService } from 'src/core/address/address.service';
import { BookingOptionsQueryDto } from 'src/dto/booking-options-query.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    private userService: UserService,
    private serviceService: ServiceService,
    private carService: CarService,
    private addressService: AddressService,
    private UtilsService: UtilsService,
  ) {}

  async create(userId: string, dto: CreateBookingDto) {
    const user = await this.userService.findOneBy({ id: userId });
    const service = await this.serviceService.findOneBy({ id: dto.serviceId });
    const { car } = await this.carService.findOne(userId, dto.carId);
    const { address } = await this.addressService.findOne(
      userId,
      dto.addressId,
    );

    if (new Date(dto.scheduledDate) < new Date()) {
      throw new BadRequestException('invalid scheduled date');
    }

    const booking = await this.bookingRepository.save({
      ...dto,
      user,
      service,
      car,
      address,
    });

    return { booking };
  }

  async findAll(
    inPagination: PaginationQueryDto,
    inBookingOptions: BookingOptionsQueryDto,
    inCondition?: any,
  ) {
    const { page, limit, offset } = this.UtilsService.getPaginationParams(
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

  async findById(bookingId: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: {
        user: true,
        service: true,
        car: true,
        address: true,
      },
    });
    if (!booking) {
      throw new NotFoundException('booking not found');
    }
    return booking;
  }

  async findOne(userId: string, bookingId: string) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId, user: { id: userId } },
      relations: {
        user: true,
        service: true,
        car: true,
        address: true,
      },
    });
    if (!booking) {
      throw new NotFoundException('booking not found');
    }
    return booking;
  }

  async update(userId: string, bookingId: string, dto: UpdateBookingDto) {
    const booking = await this.findOne(userId, bookingId);

    if (dto.scheduledDate && new Date(dto.scheduledDate) < new Date()) {
      throw new BadRequestException('invalid scheduled date');
    }

    let address = booking.address;
    if (dto.addressId) {
      address = (await this.addressService.findOne(userId, dto.addressId))
        .address;
    }

    Object.assign(booking, dto);
    await this.bookingRepository.save({ ...booking, address });
    return { message: 'booking updated successfully' };
  }

  async updateStatus(bookingId: string, status: BookingStatus) {
    await this.findById(bookingId);
    await this.bookingRepository.update(bookingId, { status });
    return { message: 'booking status updated successfully' };
  }

  async cancel(userId: string, bookingId: string) {
    const booking = await this.findOne(userId, bookingId);
    booking.status = BookingStatus.CANCELLED;
    await this.bookingRepository.save(booking);
    return { message: 'booking cancelled successfully' };
  }
}
