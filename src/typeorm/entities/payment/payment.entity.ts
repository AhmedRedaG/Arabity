import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import { Booking } from '../booking/booking.entity';

export enum PaymentMethod {
  CASH = 'cash',
  CREDIT_CARD = 'credit_card',
  WALLET = 'wallet',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('payments')
export class Payment extends MainFormat {
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  amount: number;

  @Column({ length: 20, enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ length: 20, enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ length: 255, unique: true })
  transactionId: string;

  @Column('timestamp')
  paidAt: Date;

  @ManyToOne(() => Booking, (booking) => booking.payments, { cascade: true })
  @Index()
  booking: Booking;
}
