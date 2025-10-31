import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Redirect,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { Role } from 'src/decorator/role.decorator';
import { UserRole } from '../user/entities/user.entity';
import { AuthGuard } from 'src/guard/auth.guard';
import { RoleGuard } from 'src/guard/role.guard';
import { KashierPaymentService } from '../kashier-payment/kashier-payment.service';
import { PaginationQueryDto } from 'src/dto/pagination-query.dto';
import { PaymentOptionsQueryDto } from './dto/payment-options-query.dto';
import { User } from 'src/decorator/user.decorator';

@UseGuards(AuthGuard)
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly kashierPaymentService: KashierPaymentService,
  ) {}

  @Get('online-payment/:bookingId')
  @Redirect()
  createOnlinePaymentSession(
    @User('sub') userId: string,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
  ) {
    // can create more than one in pro
    return this.kashierPaymentService.createSession(userId, bookingId);
  }

  @Get('cash/:bookingId')
  createCashPayment(
    @User('sub') userId: string,
    @Param('bookingId', ParseUUIDPipe) bookingId: string,
  ) {
    return this.paymentService.createCashPayment(userId, bookingId);
  }

  @Role(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @Get()
  findAll(
    @Query() pagination: PaginationQueryDto,
    @Query() paymentOptions: PaymentOptionsQueryDto,
  ) {
    return this.paymentService.findAll(pagination, paymentOptions);
  }

  @Role(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Role(UserRole.ADMIN)
  @UseGuards(RoleGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdatePaymentStatusDto) {
    return this.paymentService.updateStatus(id, dto.status);
  }
}
