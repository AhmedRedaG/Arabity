import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

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
