import {
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class UpdateBookingDto {
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
