import {
  IsString,
  IsUUID,
  IsInt,
  IsOptional,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { CarEngineType } from 'src/typeorm/entities/car/car.entity';

export class CreateCarDto {
  @IsUUID()
  carTypeId: string;

  @IsString()
  @MaxLength(100)
  model: string;

  @IsInt()
  @IsOptional()
  year?: number;

  @IsEnum(CarEngineType)
  engineType: CarEngineType;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  color?: string;
}
