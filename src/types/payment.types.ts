import {
  PaymentMethod,
  PaymentStatus,
} from 'src/core/payment/entities/payment.entity';

export interface KashierPaymentBookingData {
  amount: number;
  currency: string;
  bookingId: string;
}

export enum KashierPaymentStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export enum KashierOperationMode {
  TEST = 'test',
  LIVE = 'live',
}

export interface CreatePayment {
  bookingId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string;
  paidAt?: Date;
}
