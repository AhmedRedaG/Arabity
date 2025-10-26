import {
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateAddressDto {
  @IsUUID()
  cityId: string;

  @IsString()
  @Length(1, 9999)
  details: string;

  @IsPhoneNumber()
  phone: string;

  @IsLatitude()
  @IsOptional()
  latitude?: number;

  @IsLongitude()
  @IsOptional()
  longitude?: number;

  @IsString()
  @IsOptional()
  @Length(1, 9999)
  notes?: string;
}
