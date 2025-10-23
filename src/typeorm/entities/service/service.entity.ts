import { Column, Entity, OneToMany, UpdateDateColumn } from 'typeorm';
import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import { Component } from './component.entity';
import { Booking } from '../booking/booking.entity';
import { Review } from '../review/review.entity';

@Entity('services')
export class Service extends MainFormat {
  @Column({ length: 100 })
  name: string;

  @Column('text')
  description: string;

  @Column()
  basePrice: number;

  @Column('text', { nullable: true })
  imageUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  estimatedDurationMin: number;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Component, (component) => component.service)
  components: Component[];

  @OneToMany(() => Booking, (booking) => booking.service)
  bookings: Booking[];

  @OneToMany(() => Review, (review) => review.service)
  reviews: Review[];
}
