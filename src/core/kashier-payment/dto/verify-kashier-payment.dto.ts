import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import {
  KashierOperationMode,
  KashierPaymentStatus,
} from 'src/types/payment.types';

export class VerifyPaymentQueryDto {
  @IsEnum(KashierPaymentStatus)
  paymentStatus: KashierPaymentStatus;

  @IsString()
  @IsOptional()
  cardDataToken?: string;

  @IsString()
  @IsOptional()
  maskedCard?: string;

  @IsString()
  merchantOrderId: string;

  @IsString()
  orderId: string;

  @IsString()
  @IsOptional()
  cardBrand?: string;

  @IsString()
  @IsOptional()
  orderReference?: string;

  @IsString()
  transactionId: string;

  @Type(() => Number)
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsEnum(KashierOperationMode)
  mode: KashierOperationMode;

  @IsString()
  signature: string;
}
