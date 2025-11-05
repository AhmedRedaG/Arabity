import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { UserModule } from '../user/user.module';
import { DeviceTokenModule } from '../device-token/device-token.module';
import { FirebaseNotificationModule } from '../firebase-notification/firebase-notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    UserModule,
    DeviceTokenModule,
    FirebaseNotificationModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
