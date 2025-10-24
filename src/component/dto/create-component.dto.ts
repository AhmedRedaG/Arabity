import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

export class CreateComponentDto {
  @IsUUID()
  serviceId: string;

  @IsUUID()
  categoryId: string;

  @IsArray()
  @ArrayMaxSize(100)
  @IsUUID('4', { each: true })
  carTypes: string[];

  @IsString()
  @Length(1, 100)
  name: string;

  @IsString()
  @IsOptional()
  @Length(1, 9999)
  description?: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  estimatedDurationMin: number;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
