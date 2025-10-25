import { Column, Entity, OneToMany, OneToOne, UpdateDateColumn } from 'typeorm';
import { AuthAttempt } from '../auth/auth-attempt.entity';
import { Otp } from '../auth/otp.entity';
import { Car } from '../car/car.entity';
import { Booking } from '../booking/booking.entity';
import { Review } from '../review/review.entity';
import { Notification } from '../notification/notification.entity';
import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import { Address } from '../address/address.entity';

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

@Entity('users')
export class User extends MainFormat {
  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column('text', { nullable: true, select: false })
  password?: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ length: 20, enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => AuthAttempt, (authAttempt) => authAttempt.user)
  authAttempt: AuthAttempt;

  @OneToMany(() => Otp, (otp) => otp.user)
  otps: Otp[];

  @OneToMany(() => Car, (car) => car.user)
  cars: Car[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];
}
