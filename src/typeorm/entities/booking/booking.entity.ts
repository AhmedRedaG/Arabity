import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import { User } from '../user/user.entity';
import { Car } from '../car/car.entity';
import { Service } from '../service/service.entity';
import { BookingDetail } from './booking-detail.entity';
import { Payment } from '../payment/payment.entity';
import { Review } from '../review/review.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('bookings')
export class Booking extends MainFormat {
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalPrice: number;

  @Column('timestamp')
  bookingDate: Date;

  @Column('timestamp')
  scheduledDate: Date;

  @Column('text')
  locationDetails: string;

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  locationLat: number;

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  locationLong: number;

  @Column({ length: 20, enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column('text', { nullable: true })
  notes: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BookingDetail, (detail) => detail.booking)
  details: BookingDetail[];

  @OneToMany(() => Payment, (payment) => payment.booking)
  payments: Payment[];

  @OneToMany(() => Review, (review) => review.booking)
  reviews: Review[];

  @ManyToOne(() => User, (user) => user.bookings, {
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
    cascade: true,
  })
  @Index()
  user: User;

  @ManyToOne(() => Car, (car) => car.bookings, {
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
    cascade: true,
  })
  @Index()
  car: Car;

  @ManyToOne(() => Service, (service) => service.bookings, {
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
    cascade: true,
  })
  @Index()
  service: Service;
}
