import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderDirection } from '../types/order.types';

export class OptionsQueryDto {
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsString()
  orderBy: string = 'createdAt';

  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection: OrderDirection = OrderDirection.DESC;

  @IsOptional()
  @IsString()
  search?: string;
}
