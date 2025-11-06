import { Module } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';
import { PushNotificationController } from './push-notification.controller';
import { UserModule } from '../user/user.module';
import { DeviceTokenModule } from '../device-token/device-token.module';
import { FirebaseNotificationModule } from '../firebase-notification/firebase-notification.module';
import { NotificationModule } from '../notification/notification.module';
import { BookingNotificationContent } from './content/booking-notification.content';

@Module({
  imports: [
    UserModule,
    DeviceTokenModule,
    FirebaseNotificationModule,
    NotificationModule,
  ],
  controllers: [PushNotificationController],
  providers: [PushNotificationService, BookingNotificationContent],
  exports: [PushNotificationService],
})
export class PushNotificationModule {}
