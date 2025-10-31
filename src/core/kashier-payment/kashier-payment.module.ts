import { forwardRef, Module } from '@nestjs/common';
import { KashierPaymentService } from './kashier-payment.service';
import { BookingModule } from '../booking/booking.module';
import { KashierPaymentController } from './kashier-payment.controller';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [BookingModule, forwardRef(() => PaymentModule)],
  controllers: [KashierPaymentController],
  providers: [KashierPaymentService],
  exports: [KashierPaymentService],
})
export class KashierPaymentModule {}
