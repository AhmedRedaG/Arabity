import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { UserModule } from '../user/user.module';
import { PushNotificationModule } from '../push-notification/push-notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    UserModule,
    PushNotificationModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
