import { Injectable } from '@nestjs/common';
import { SnapTransactionParameter } from 'midtrans-client';
import { MidtransService } from 'src/lib/payment-gateway/providers/midtrans/midtrans.service';
import { PaymentGatewayService } from '../../lib/payment-gateway/payment-gateway.service';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentGatewayService: PaymentGatewayService) {}

  private get paymentGateway() {
    return this.paymentGatewayService as MidtransService;
  }

  async createTransactionToken(
    data: SnapTransactionParameter['transaction_details'],
  ) {
    return this.paymentGateway.snap.createTransactionToken({
      transaction_details: data,
    });
  }

  async createTransactionRedirectUrl(
    data: SnapTransactionParameter['transaction_details'],
  ) {
    return this.paymentGateway.snap.createTransactionRedirectUrl({
      transaction_details: data,
    });
  }

  async createTransaction(
    data: SnapTransactionParameter['transaction_details'],
  ) {
    return this.paymentGateway.snap.createTransaction({
      transaction_details: data,
    });
  }

  async updateStatus(trxId: string) {
    return this.paymentGateway.coreAPI.updateStatus(trxId);
  }
}
