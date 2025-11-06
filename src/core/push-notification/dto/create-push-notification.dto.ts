import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { NotificationType } from 'src/core/notification/entities/notification.entity';

export class CreatePushNotificationDto {
  @IsString()
  @Length(1, 255)
  title: string;

  @IsString()
  @Length(1, 255)
  body: string;

  @IsOptional()
  @IsObject()
  data?: Record<string, string>;
}

export class CreateToOnePushNotificationDto extends CreatePushNotificationDto {
  @IsUUID()
  userId: string;

  @IsEnum(NotificationType)
  type: NotificationType;
}

export class CreateToManyPushNotificationDto extends CreatePushNotificationDto {
  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];
}

export class CreateToAllPushNotificationDto extends CreatePushNotificationDto {
  @IsString()
  @IsOptional()
  topic?: string;
}
