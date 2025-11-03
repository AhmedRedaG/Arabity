import { Module } from '@nestjs/common';
import { FirebaseNotificationService } from './firebase-notification.service';
import { FirebaseNotificationController } from './firebase-notification.controller';

@Module({
  controllers: [FirebaseNotificationController],
  providers: [FirebaseNotificationService],
})
export class FirebaseNotificationModule {}
