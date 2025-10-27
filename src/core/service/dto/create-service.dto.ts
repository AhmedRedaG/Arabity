import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsUrl,
  Min,
  Length,
  IsArray,
  ArrayMaxSize,
  IsUUID,
  IsEnum,
  ArrayMinSize,
} from 'class-validator';
import { requiredCategoryStatus } from 'src/core/service/entities/service.entity';

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

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  @IsUUID('4', { each: true })
  @IsOptional()
  categories: string[];

  @IsEnum(requiredCategoryStatus)
  @IsOptional()
  requiredCategoryStatus: requiredCategoryStatus;

  @IsInt()
  @Min(1)
  estimatedDurationMin: number;
}
