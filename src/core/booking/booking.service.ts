import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AddressCase,
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
import { ConfigService } from '@nestjs/config';
import { RebookBookingDto } from './dto/rebook-booking.dto';
import { PushNotificationService } from '../push-notification/push-notification.service';

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
    private configService: ConfigService,
    private pushNotificationService: PushNotificationService,
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

  isAtLeastFromNow(dateString: Date, pendingTimeMs: number) {
    const inputDate = new Date(dateString);
    const now = new Date();

    const diffMs = inputDate.getTime() - now.getTime();

    return diffMs >= pendingTimeMs;
  }

  async create(userId: string, dto: CreateBookingDto) {
    const user = await this.userService.findOneBy({ id: userId });
    const service = await this.serviceService.findOneBy({
      id: dto.serviceId,
      isActive: true,
    });

    const pendingTimeMS = this.configService.get<number>(
      'booking.pendingTimeMS',
    )!;
    const isAtLeastFromNow = this.isAtLeastFromNow(
      dto.scheduledDate,
      pendingTimeMS,
    );
    if (!isAtLeastFromNow) {
      throw new BadRequestException(
        `scheduled date must be at least ${pendingTimeMS / 60_000} minutes from now`,
      );
    }

    let address: Address | undefined;
    if (dto.addressId) {
      address = (await this.addressService.findOne(userId, dto.addressId))
        .address;
      dto.addressCase = AddressCase.USER_ADDRESS;
    }

    const { car } = await this.carService.findOne(userId, dto.carId);

    const serviceCategories = await this.componentCategoryService.findAll({
      services: { id: service.id },
    });
    const serviceCategoriesIds = serviceCategories.categories.map(
      (category) => category.id,
    );

    const componentsDetails: BookingDetail[] = [];
    let componentsPrice = 0;
    let componentsEstimatedDurationMin = 0;

    if (dto.components) {
      if (serviceCategoriesIds.length === 0) {
        throw new BadRequestException('invalid components');
      }

      const validComponents =
        await this.componentService.findForBookingByCarType(
          dto.components,
          car.type.id,
        );

      const componentsCategoriesIds = validComponents.map(
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

      validComponents.forEach((component) => {
        const componentDetail = new BookingDetail();
        componentDetail.component = component;
        componentDetail.unitPriceWhenBooking = component.price;

        componentsDetails.push(componentDetail);
        componentsPrice += component.price;
        componentsEstimatedDurationMin += component.estimatedDurationMin;
      });
    } else {
      if (serviceCategoriesIds.length > 0) {
        throw new BadRequestException('missing components');
      }
    }

    const totalPrice = service.basePrice + componentsPrice;
    const estimatedDurationMin =
      service.estimatedDurationMin + componentsEstimatedDurationMin;
    const departureDate = new Date(dto.scheduledDate);
    departureDate.setMinutes(departureDate.getMinutes() + estimatedDurationMin);

    const booking = await this.bookingRepository.save({
      ...dto,
      user,
      service,
      car,
      address,
      totalPrice,
      departureDate,
      estimatedDurationMin,
      details: componentsDetails,
    });

    await this.pushNotificationService.pushBookingStatus(
      userId,
      booking.id,
      booking.status,
    );

    return { booking };
  }

  async rebook(userId: string, bookingId: string, dto: RebookBookingDto) {
    const oldBooking = (
      await this.findOneByWithDetails({
        id: bookingId,
        user: { id: userId },
      })
    ).booking;

    const components = oldBooking.details.map((detail) => detail.component.id);
    const newBookingDto: CreateBookingDto = {
      ...dto,
      components,
      carId: oldBooking.car.id,
      serviceId: oldBooking.service.id,
    };
    return this.create(userId, newBookingDto);
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
        reviews: true,
      },
    });
    if (!booking) {
      throw new NotFoundException('booking not found');
    }
    return { booking };
  }

  async updateBookingAddress(
    userId: string,
    addressId: string | undefined,
    addressCase: AddressCase | undefined,
  ) {
    let address: Address | null | undefined;

    if (addressCase) {
      switch (addressCase) {
        case AddressCase.USER_ADDRESS:
          if (!addressId)
            throw new BadRequestException(
              'missing address id for user address case',
            );
          address = (await this.addressService.findOne(userId, addressId))
            .address;
          addressCase = AddressCase.USER_ADDRESS;
          break;

        case AddressCase.CENTER:
          if (addressId)
            throw new BadRequestException(
              'additional address id for center address case',
            );
          address = null;
          break;
      }
    } else {
      if (addressId) throw new BadRequestException('missing address case');
    }

    return { address, addressCase };
  }

  async update(userId: string, bookingId: string, dto: UpdateBookingDto) {
    if (dto.scheduledDate) {
      const pendingTimeMS = this.configService.get<number>(
        'booking.pendingTimeMS',
      )!;
      const isAtLeastFromNow = this.isAtLeastFromNow(
        dto.scheduledDate,
        pendingTimeMS,
      );
      if (!isAtLeastFromNow) {
        throw new BadRequestException(
          `scheduled date must be at least ${pendingTimeMS / 60_000} minutes from now`,
        );
      }
    }

    await this.findOneBy({ id: bookingId, user: { id: userId } });

    const { address, addressCase } = await this.updateBookingAddress(
      userId,
      dto.addressId,
      dto.addressCase,
    );
    if (dto.addressId) delete dto.addressId;

    await this.bookingRepository.update(bookingId, {
      ...dto,
      addressCase,
      address,
    });

    return { message: 'booking updated successfully' };
  }

  async updateStatus(bookingId: string, status: BookingStatus) {
    const booking = await this.findOneBy({ id: bookingId });
    await this.bookingRepository.update(bookingId, { status });
    await this.pushNotificationService.pushBookingStatus(
      booking.userId,
      bookingId,
      status,
    );
    return { message: 'booking status updated successfully' };
  }

  async cancel(userId: string, bookingId: string) {
    await this.findOneBy({
      id: bookingId,
      user: { id: userId },
    });
    await this.bookingRepository.update(bookingId, {
      status: BookingStatus.CANCELLED,
    });
    await this.pushNotificationService.pushBookingStatus(
      userId,
      bookingId,
      BookingStatus.CANCELLED,
    );
    return { message: 'booking cancelled successfully' };
  }
}
