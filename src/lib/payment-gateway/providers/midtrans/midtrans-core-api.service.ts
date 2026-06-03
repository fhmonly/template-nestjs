import { Inject } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import MidtransClient from 'midtrans-client';
import { PaymentGatewayService } from '../../payment-gateway.service';
import midtransEnvConfig from './midtrans-env.config';

export class MidtransCoreAPIService extends PaymentGatewayService {
  private readonly coreAPI: MidtransClient.CoreApi;

  constructor(
    @Inject(midtransEnvConfig.KEY)
    private readonly config: ConfigType<typeof midtransEnvConfig>,
  ) {
    super();
    this.coreAPI = new MidtransClient.CoreApi(config);
  }

  async updateStatus(trxId: string) {
    return await this.coreAPI.transaction.status(trxId);
  }
}
