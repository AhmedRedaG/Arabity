import { Injectable } from '@nestjs/common';
import { BookingStatus } from 'src/core/booking/entities/booking.entity';

@Injectable()
export class BookingNotificationContent {
  pending() {
    return {
      title: 'Booking Received',
      body: 'Your booking request has been received and is pending confirmation.',
    };
  }

  confirmed(bookingId: string) {
    return {
      title: 'Booking Confirmed',
      body: `Your car service booking has been confirmed! Our team will contact you soon.\nYour booking id:${bookingId}\nThank you for choosing Arabity!`,
    };
  }

  inProgress() {
    return {
      title: 'Service in Progress',
      body: 'Your car service is currently in progress. We’ll notify you once it’s done.',
    };
  }

  completed() {
    return {
      title: 'Service Completed',
      body: 'Your car service is completed.\nPlease give us your feedback.\nThank you for choosing Arabity!',
    };
  }

  cancelled(bookingId: string) {
    return {
      title: 'Booking Cancelled',
      body: `Your booking has been cancelled.\nYour booking id: ${bookingId}\nYou can book another service anytime.`,
    };
  }

  getTemplate(status: BookingStatus, bookingId: string) {
    switch (status) {
      case BookingStatus.PENDING:
        return this.pending();
      case BookingStatus.CONFIRMED:
        return this.confirmed(bookingId);
      case BookingStatus.IN_PROGRESS:
        return this.inProgress();
      case BookingStatus.COMPLETED:
        return this.completed();
      case BookingStatus.CANCELLED:
        return this.cancelled(bookingId);
      default:
        throw new Error(`Invalid booking status`);
    }
  }
}
