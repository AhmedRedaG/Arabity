import { IsString, Length } from 'class-validator';

export class InvalidateDeviceTokenDto {
  @IsString()
  @Length(50, 500)
  deviceToken: string;
}
