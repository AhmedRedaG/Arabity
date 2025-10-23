import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsInt,
  IsUrl,
  IsPositive,
  Min,
  Length,
} from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsOptional()
  basePrice?: number;

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
