import { Injectable } from '@nestjs/common';
import { PaymentStatus } from 'src/core/payment/entities/payment.entity';

@Injectable()
export class PaymentNotificationContent {
  pending(amount?: number) {
    return {
      title: 'Payment Pending',
      body: amount
        ? `Your payment of ${amount} EGP is being processed.`
        : 'Your payment is being processed.',
    };
  }

  paid(amount?: number) {
    return {
      title: 'Payment Successful',
      body: amount
        ? `Your payment of ${amount} EGP was successful. Thank you for using Arabity!`
        : 'Your payment was successful. Thank you for using Arabity!',
    };
  }

  failed(amount?: number) {
    return {
      title: 'Payment Failed',
      body: amount
        ? `Your payment of ${amount} EGP failed. Please try again or use a different method.`
        : 'Your payment failed. Please try again or use a different method.',
    };
  }

  refunded(amount?: number) {
    return {
      title: 'Payment Refunded',
      body: amount
        ? `Your payment of ${amount} EGP has been refunded successfully.`
        : 'Your payment has been refunded successfully.',
    };
  }

  getTemplate(status: PaymentStatus, amount?: number) {
    switch (status) {
      case PaymentStatus.PENDING:
        return this.pending(amount);
      case PaymentStatus.PAID:
        return this.paid(amount);
      case PaymentStatus.FAILED:
        return this.failed(amount);
      case PaymentStatus.REFUNDED:
        return this.refunded(amount);
    }
  }
}
