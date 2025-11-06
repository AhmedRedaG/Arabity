import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { KashierPaymentModule } from 'src/core/kashier-payment/kashier-payment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { BookingModule } from '../booking/booking.module';
import { PushNotificationModule } from '../push-notification/push-notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    KashierPaymentModule,
    BookingModule,
    PushNotificationModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
