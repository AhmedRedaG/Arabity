import { Exclude } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { AddressCase } from '../entities/booking.entity';

export class CreateBookingDto {
  @IsUUID()
  carId: string;

  @IsUUID()
  serviceId: string;

  @Exclude()
  addressCase: AddressCase;

  @IsUUID()
  @IsOptional()
  addressId?: string;

  @IsDateString()
  scheduledDate: Date;

  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @IsUUID('4', { each: true })
  components?: string[];

  @IsString()
  @IsOptional()
  @Length(1, 9999)
  notes?: string;
}
