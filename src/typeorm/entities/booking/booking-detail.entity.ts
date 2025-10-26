import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import { Booking } from './booking.entity';
import { Component } from '../../../core/component/entities/component.entity';

@Entity('booking_details')
export class BookingDetail extends MainFormat {
  @Column({ default: 1 })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  unitPrice: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @ManyToOne(() => Booking, (booking) => booking.details, {
    cascade: true,
  })
  @Index()
  booking: Booking;

  @ManyToOne(() => Component, (component) => component.bookingDetails, {
    cascade: true,
  })
  @Index()
  component: Component;
}
