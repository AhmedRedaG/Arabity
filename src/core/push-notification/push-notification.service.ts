import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateToAllPushNotificationDto,
  CreateToManyPushNotificationDto,
  CreateToOnePushNotificationDto,
} from './dto/create-push-notification.dto';
import { UserService } from '../user/user.service';
import { DeviceTokenService } from '../device-token/device-token.service';
import { FirebaseNotificationService } from '../firebase-notification/firebase-notification.service';

@Injectable()
export class PushNotificationService {
  constructor(
    private userService: UserService,
    private deviceTokenService: DeviceTokenService,
    private firebaseNotificationService: FirebaseNotificationService,
  ) {}

  async pushToOne(dto: CreateToOnePushNotificationDto) {
    await this.userService.findOneBy({ id: dto.userId });

    const deviceTokens = await this.deviceTokenService.getUserTokens(
      dto.userId,
    );

    if (deviceTokens.length === 0) {
      throw new NotFoundException('user has no device tokens');
    }

    await this.firebaseNotificationService.sendToMultipleDevices(
      deviceTokens,
      dto.title,
      dto.body,
      dto.data,
    );

    return { message: 'notification sent successfully' };
  }

  async pushToMany(dto: CreateToManyPushNotificationDto) {
    const deviceTokens: string[] = [];

    for (const userId of dto.userIds) {
      await this.userService.findOneBy({ id: userId });
      const tokens = await this.deviceTokenService.getUserTokens(userId);
      deviceTokens.push(...tokens);
    }

    await this.firebaseNotificationService.sendToMultipleDevices(
      deviceTokens,
      dto.title,
      dto.body,
      dto.data,
    );

    return { message: 'notifications sent successfully' };
  }

  async pushToAll(dto: CreateToAllPushNotificationDto) {
    const topic = dto.topic || 'all-users';

    await this.firebaseNotificationService.sendToTopic(
      topic,
      dto.title,
      dto.body,
      dto.data,
    );

    return { message: 'notifications sent successfully' };
  }
}
