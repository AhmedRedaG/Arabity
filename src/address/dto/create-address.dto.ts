import {
  IsLatitude,
  IsLongitude,
  IsOptional,
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
