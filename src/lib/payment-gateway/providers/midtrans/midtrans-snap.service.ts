import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import MidtransClient from 'midtrans-client';
import { PaymentGatewayService } from '../../payment-gateway.service';
import midtransEnvConfig from './midtrans-env.config';

@Injectable()
export class MidtransSnapService extends PaymentGatewayService {
  private readonly snap: MidtransClient.Snap;

  constructor(
    @Inject(midtransEnvConfig.KEY)
    private readonly config: ConfigType<typeof midtransEnvConfig>,
  ) {
    super();
    this.snap = new MidtransClient.Snap(config);
  }

  async createTransaction(payload: MidtransClient.SnapTransactionParameter) {
    const trx = await this.snap.createTransaction(payload);

    if (!!trx.error_messages?.length) {
      throw new Error(trx.error_messages[0]);
    }

    return {
      token: trx.token,
      redirectUrl: trx.redirect_url,
    };
  }

  async createTransactionToken(
    payload: MidtransClient.SnapTransactionParameter,
  ) {
    return await this.snap.createTransactionToken(payload);
  }

  async createTransactionRedirectUrl(
    payload: MidtransClient.SnapTransactionParameter,
  ) {
    return await this.snap.createTransactionRedirectUrl(payload);
  }
}
