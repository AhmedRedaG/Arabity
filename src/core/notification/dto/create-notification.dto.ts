import { IsString, IsEnum, IsUUID, Length } from 'class-validator';
import { NotificationType } from '../entities/notification.entity';

export class CreateNotificationDto {
  @IsString()
  @Length(1, 150)
  title: string;

  @IsString()
  @Length(1, 9999)
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsUUID()
  userId: string;
}
