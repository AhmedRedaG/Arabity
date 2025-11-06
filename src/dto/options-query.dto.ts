import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { OrderDirection } from '../types/order.types';

export class OptionsQueryDto {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): string | boolean => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  orderBy: string = 'createdAt';

  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection: OrderDirection = OrderDirection.DESC;

  @IsOptional()
  @IsString()
  @Length(3, 100)
  search?: string;
}
