import { IsEnum } from 'class-validator';
import { BookingStatus } from 'src/typeorm/entities/booking/booking.entity';

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
