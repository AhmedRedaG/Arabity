import { IsUUID } from 'class-validator';
import { CreateDeviceTokenDto } from './create-device-token.dto';

export class UpdateDeviceTokenDto extends CreateDeviceTokenDto {
  @IsUUID()
  deviceId: string;
}
