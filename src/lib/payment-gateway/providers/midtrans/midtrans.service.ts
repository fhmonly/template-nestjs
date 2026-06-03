import { Injectable } from '@nestjs/common';
import { PaymentGatewayService } from '../../payment-gateway.service';
import { MidtransCoreAPIService } from './midtrans-core-api.service';
import { MidtransSnapService } from './midtrans-snap.service';

@Injectable()
export class MidtransService extends PaymentGatewayService {
  constructor(
    readonly snap: MidtransSnapService,
    readonly coreAPI: MidtransCoreAPIService,
  ) {
    super();
  }
}
