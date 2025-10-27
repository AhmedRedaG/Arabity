import { IsEnum } from 'class-validator';
import { BookingStatus } from 'src/core/booking/entities/booking.entity';

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
