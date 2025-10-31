import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { URLSearchParams } from 'url';
import { KashierPaymentConfig } from 'src/types/config.types';
import {
  CreatePayment,
  KashierPaymentBookingData,
  KashierPaymentStatus,
} from 'src/types/payment.types';
import { BookingService } from '../booking/booking.service';
import { VerifyPaymentQueryDto } from './dto/verify-kashier-payment.dto';
import {
  PaymentMethod,
  PaymentStatus,
} from '../payment/entities/payment.entity';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class KashierPaymentService {
  private readonly kashierPaymentConfig: KashierPaymentConfig;
  private readonly redirectUrl: string;
  // private readonly webhookUrl: string;

  constructor(
    private configService: ConfigService,
    private bookingService: BookingService,
    private paymentService: PaymentService,
  ) {
    this.kashierPaymentConfig = this.configService.get('kashierPayment')!;

    const apiUrl = this.configService.get<string>('api.baseUrl')!;
    // const clientUrl = this.configService.get<string>('client.baseUrl')!;

    this.redirectUrl = `${apiUrl}/kashier-payments/verify`;

    // in production
    // this.redirectUrl = `${clientUrl}/payment-status`;
    // this.webhookUrl = `${apiUrl}/payments/verify`;
  }

  async createSession(userId: string, bookingId: string) {
    const booking = await this.bookingService.findOneBy({
      id: bookingId,
      user: { id: userId },
    });
    const bookingPaymentData: KashierPaymentBookingData = {
      amount: booking.totalPrice,
      currency: booking.currency,
      bookingId: booking.id,
    };
    const paymentUrl = this.createPaymentUrl(bookingPaymentData);
    return { url: paymentUrl };
  }

  private generateOrderHash(booking: KashierPaymentBookingData) {
    const { amount, currency, bookingId } = booking;

    const path = `/?payment=${this.kashierPaymentConfig.merchantId}.${bookingId}.${amount}.${currency}`;

    const hash = crypto
      .createHmac('sha256', this.kashierPaymentConfig.apiKey)
      .update(path)
      .digest('hex');

    return hash;
  }

  private createPaymentUrl(booking: KashierPaymentBookingData) {
    const { amount, currency, bookingId } = booking;

    const hash = this.generateOrderHash(booking);
    const baseUrl = 'https://payments.kashier.io/';

    const params = new URLSearchParams({
      merchantId: this.kashierPaymentConfig.merchantId,
      orderId: bookingId,
      amount: amount.toString(),
      currency: currency,
      hash: hash,
      mode: this.kashierPaymentConfig.mode,
      merchantRedirect: this.redirectUrl,
      // serverWebhook: this.webhookUrl,
      display: 'en',
    });

    return `${baseUrl}?${params.toString()}`;
  }

  private isValidSignature(query: VerifyPaymentQueryDto): boolean {
    if (!query.signature) {
      return false;
    }

    const receivedSignature = query.signature;
    let queryString = '';

    const keys = Object.keys(query);
    for (const key of keys) {
      if (key === 'signature' || key === 'mode') {
        continue;
      }
      queryString += `&${key}=${query[key]}`;
    }
    const finalUrl = queryString.substring(1);

    const generatedSignature = crypto
      .createHmac('sha256', this.kashierPaymentConfig.apiKey)
      .update(finalUrl)
      .digest('hex');

    console.log(generatedSignature);
    console.log(receivedSignature);

    return generatedSignature === receivedSignature;
  }

  async verifyPayment(query: VerifyPaymentQueryDto) {
    if (!this.isValidSignature(query)) {
      throw new ForbiddenException('invalid payment signature');
    }

    const paymentData: CreatePayment = {
      bookingId: query.merchantOrderId,
      amount: query.amount,
      currency: query.currency,
      paymentMethod: PaymentMethod.KASHIER,
      paymentStatus:
        query.paymentStatus === KashierPaymentStatus.SUCCESS
          ? PaymentStatus.PAID
          : PaymentStatus.FAILED,
      transactionId: query.transactionId,
      paidAt:
        query.paymentStatus === KashierPaymentStatus.SUCCESS
          ? new Date()
          : undefined,
    };

    await this.paymentService.create(paymentData);

    return {
      status:
        query.paymentStatus === KashierPaymentStatus.SUCCESS
          ? 'success'
          : 'fail',
    };
  }
}
