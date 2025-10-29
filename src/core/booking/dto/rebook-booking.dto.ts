import { Exclude } from 'class-transformer';
import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { AddressCase } from '../entities/booking.entity';

export class RebookBookingDto {
  @Exclude()
  addressCase: AddressCase;

  @IsUUID()
  @IsOptional()
  addressId?: string;

  @IsDateString()
  scheduledDate: Date;

  @IsString()
  @IsOptional()
  @Length(1, 9999)
  notes?: string;
}
