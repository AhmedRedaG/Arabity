import { Controller, Get, Query, Render } from '@nestjs/common';
import { KashierPaymentService } from './kashier-payment.service';
import { VerifyPaymentQueryDto } from './dto/verify-kashier-payment.dto';

@Controller('kashier-payments')
export class KashierPaymentController {
  constructor(private readonly kashierPaymentService: KashierPaymentService) {}

  @Get('/verify')
  @Render('payment-result')
  verify(
    // @Query() query: VerifyPaymentQueryDto
    @Query() query: VerifyPaymentQueryDto,
  ) {
    return this.kashierPaymentService.verifyPayment(query);
  }
}
