import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { BookingService } from '../booking/booking.service';
import { CreatePayment } from 'src/types/payment.types';
import {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from './entities/payment.entity';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { PaymentOptionsQueryDto } from './dto/payment-options-query.dto';
import { UtilsService } from '../utils/utils.service';
import {
  TypeOrmFindOptionsRelations,
  TypeOrmFindOptionsWhere,
} from 'src/types/typeorm-find-options.types';
import { BookingStatus } from '../booking/entities/booking.entity';
import { PushNotificationService } from '../push-notification/push-notification.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private bookingService: BookingService,
    private utilsService: UtilsService,
    private pushNotificationService: PushNotificationService,
  ) {}

  async create(inPayment: CreatePayment) {
    await this.paymentRepository.save(inPayment);

    const booking = await this.bookingService.findOneBy({
      id: inPayment.bookingId,
    });
    await this.pushNotificationService.pushPaymentStatus(
      booking.userId,
      inPayment.paymentStatus,
      inPayment.amount,
    );

    if (
      inPayment.paymentStatus === PaymentStatus.PAID ||
      inPayment.paymentMethod === PaymentMethod.CASH
    ) {
      await this.bookingService.updateStatus(
        inPayment.bookingId,
        BookingStatus.CONFIRMED,
      );
    }
  }

  async createCashPayment(userId: string, bookingId: string) {
    const booking = await this.bookingService.findOneBy({
      id: bookingId,
      user: { id: userId },
    });

    let isPaid: boolean = true;
    try {
      await this.findOneBy({
        bookingId,
        paymentStatus: PaymentStatus.PAID,
      });
    } catch {
      isPaid = false;
    }
    if (isPaid) {
      throw new BadRequestException('booking already paid');
    }

    const transactionId =
      'CSH-' + Date.now() + Math.random().toString().substring(2, 5);
    const paymentData: CreatePayment = {
      bookingId,
      transactionId,
      amount: booking.totalPrice,
      currency: booking.currency,
      paymentMethod: PaymentMethod.CASH,
      paymentStatus: PaymentStatus.PENDING,
    };
    await this.create(paymentData);

    return { message: 'payment created successfully' };
  }

  async findAll(
    inPagination: PaginationQueryDto,
    inPaymentOptions: PaymentOptionsQueryDto,
    inCondition?: TypeOrmFindOptionsRelations<Payment>,
  ) {
    const { page, limit, offset } = this.utilsService.getPaginationParams(
      inPagination.page,
      inPagination.limit,
    );

    const where = {};
    if (inCondition) {
      Object.assign(where, inCondition);
    }
    if (inPaymentOptions.userId) {
      where['booking'] = { user: { id: inPaymentOptions.userId } };
    }
    if (inPaymentOptions.status) {
      where['status'] = inPaymentOptions.status;
    }

    const { startDate, endDate } = inPaymentOptions;
    if (startDate && endDate) {
      where['scheduledDate'] = Between(startDate, endDate);
    } else if (startDate) {
      where['scheduledDate'] = MoreThanOrEqual(startDate);
    } else if (endDate) {
      where['scheduledDate'] = LessThanOrEqual(endDate);
    }

    const [payments, total] = await this.paymentRepository.findAndCount({
      where,
      relations: {
        booking: true,
      },
      skip: offset,
      take: limit,
      order: {
        [inPaymentOptions.orderBy]: inPaymentOptions.orderDirection,
      },
    });

    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };

    return { pagination, payments };
  }

  async findOneBy(findOptions: TypeOrmFindOptionsWhere<Payment>) {
    const payment = await this.paymentRepository.findOneBy(findOptions);
    if (!payment) {
      throw new NotFoundException('payment not found');
    }
    return { payment };
  }

  async findOne(id: string) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: {
        booking: {
          user: true,
        },
      },
    });
    if (!payment) {
      throw new NotFoundException('payment not found');
    }
    return { payment };
  }

  async updateStatus(id: string, paymentStatus: PaymentStatus) {
    const { payment } = await this.findOne(id);

    let paidAt: Date | undefined;
    if (paymentStatus === PaymentStatus.PAID) {
      paidAt = new Date();
    }

    await this.paymentRepository.update(id, { paymentStatus, paidAt });

    await this.pushNotificationService.pushPaymentStatus(
      payment.booking.userId,
      paymentStatus,
      payment.amount,
    );

    return { message: 'payment status updated successfully' };
  }
}
