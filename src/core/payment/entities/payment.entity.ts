import { Column, Entity, Index, ManyToOne, UpdateDateColumn } from 'typeorm';
import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import { Booking } from '../../booking/entities/booking.entity';

export enum PaymentMethod {
  CASH = 'cash',
  KASHIER = 'kashier',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

@Entity('payments')
export class Payment extends MainFormat {
  @Column()
  amount: number;

  @Column({ length: 20, default: 'EGP' })
  currency: string;

  @Column({ length: 20, enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Column({ length: 20, enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Column({ length: 255, unique: true })
  transactionId: string;

  @Column('timestamp', { nullable: true })
  paidAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Booking, (booking) => booking.payments)
  @Index()
  booking: Booking;
  @Column()
  bookingId: string;
}
