import { Entity, Index, ManyToOne } from 'typeorm';
import { MainFormat } from 'src/typeorm/abstractions/main-format.abstract';
import { Booking } from './booking.entity';
import { Component } from '../../component/entities/component.entity';

@Entity('booking_details')
export class BookingDetail extends MainFormat {
  @ManyToOne(() => Booking, (booking) => booking.details)
  @Index()
  booking: Booking;

  @ManyToOne(() => Component, (component) => component.bookingDetails, {
    cascade: true,
  })
  @Index()
  component: Component;
}
