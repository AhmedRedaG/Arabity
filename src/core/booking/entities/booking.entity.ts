import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import { User } from '../../user/entities/user.entity';
import { Car } from '../../car/entities/car.entity';
import { Service } from '../../service/entities/service.entity';
import { BookingDetail } from './booking-detail.entity';
import { Payment } from '../../../typeorm/entities/payment/payment.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Address } from '../../address/entities/address.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('bookings')
export class Booking extends MainFormat {
  @Column({ default: 0 })
  totalPrice: number;

  @Column('timestamp')
  scheduledDate: Date;

  @Column('timestamp')
  departureDate: Date;

  @Column()
  estimatedDurationMin: number;

  @Column({ length: 20, enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column('text', { nullable: true })
  notes?: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => BookingDetail, (detail) => detail.booking, {
    cascade: true,
  })
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

  @ManyToOne(() => Address, (address) => address.bookings, {
    onDelete: 'SET NULL',
    onUpdate: 'SET NULL',
    cascade: true,
  })
  @Index()
  address: Address;
}
