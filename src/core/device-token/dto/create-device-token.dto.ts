import { IsString, IsOptional, Length, IsEnum } from 'class-validator';
import { Platform } from '../entities/device-token.entity';

export class CreateDeviceTokenDto {
  @IsString()
  @Length(50, 500)
  deviceToken: string;

  @IsOptional()
  @IsEnum(Platform)
  platform?: Platform;
}
