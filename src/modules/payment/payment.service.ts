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
    const trx = await this.paymentGateway.snap.createTransactionToken({
      transaction_details: data,
    });
    return {
      data: { token: trx },
    };
  }

  async createTransactionRedirectUrl(
    data: SnapTransactionParameter['transaction_details'],
  ) {
    const trx = await this.paymentGateway.snap.createTransactionRedirectUrl({
      transaction_details: data,
    });
    return {
      data: { redirect_url: trx },
    };
  }

  async createTransaction(
    data: SnapTransactionParameter['transaction_details'],
  ) {
    const trx = await this.paymentGateway.snap.createTransaction({
      transaction_details: data,
    });
    return {
      data: trx,
    };
  }

  async updateStatus(trxId: string) {
    const trx = await this.paymentGateway.coreAPI.updateStatus(trxId);
    return {
      data: trx,
    };
  }
}
