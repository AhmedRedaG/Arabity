import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsUrl,
  Min,
  Length,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 9999)
  description: string;

  @IsInt()
  @Min(1)
  basePrice: number;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsInt()
  @Min(1)
  estimatedDurationMin: number;
}
