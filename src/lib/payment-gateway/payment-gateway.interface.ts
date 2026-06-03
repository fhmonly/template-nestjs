import { DynamicModule, Type } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';

export interface PaymentGatewayModuleOptions {
  imports?: DynamicModule[] | Type<any>[];
  provider: Type<PaymentGatewayService>;
}
