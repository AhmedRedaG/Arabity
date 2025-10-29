import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { AddressCase } from '../entities/booking.entity';

export class UpdateBookingDto {
  @IsEnum(AddressCase)
  @IsOptional()
  addressCase?: AddressCase;

  @IsUUID()
  @IsOptional()
  addressId?: string;

  @IsDateString()
  @IsOptional()
  scheduledDate?: Date;

  @IsString()
  @IsOptional()
  @Length(1, 9999)
  notes?: string;
}
