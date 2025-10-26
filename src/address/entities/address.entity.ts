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
import { AddressCity } from '../../address-city/entities/address-city.entity';
import { Booking } from '../../typeorm/entities/booking/booking.entity';

@Entity('addresses')
export class Address extends MainFormat {
  @Column('text')
  details: string;

  @Column({ length: 20 })
  phone: string;

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 9, scale: 6, nullable: true })
  longitude: number;

  @Column('text', { nullable: true })
  notes: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Booking, (booking) => booking.address)
  bookings: Booking[];

  @ManyToOne(() => AddressCity, (city) => city.addresses)
  @Index()
  city: AddressCity;

  @ManyToOne(() => User, (user) => user.addresses, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    cascade: true,
  })
  @Index()
  user: User;
}
