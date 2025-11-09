import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Min,
} from 'class-validator';

export class CreateComponentDto {
  @IsUUID()
  categoryId: string;

  @IsArray()
  @ArrayMinSize(1)
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

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
