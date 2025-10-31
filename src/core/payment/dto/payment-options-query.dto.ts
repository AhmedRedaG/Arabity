import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { OptionsQueryDto } from '../../../dto/options-query.dto';
import { PaymentStatus } from '../entities/payment.entity';

export class PaymentOptionsQueryDto extends OptionsQueryDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsUUID()
  userId?: string;
}
