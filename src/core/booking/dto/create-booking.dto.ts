import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  carId: string;

  @IsUUID()
  serviceId: string;

  @IsUUID()
  addressId: string;

  @IsDateString()
  scheduledDate: Date;

  @IsString()
  @IsOptional()
  @Length(1, 9999)
  notes?: string;
}
