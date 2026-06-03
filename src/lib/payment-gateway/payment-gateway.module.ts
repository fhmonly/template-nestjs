// cache.module.ts

import { DynamicModule, Module } from '@nestjs/common';
import { PaymentGatewayModuleOptions } from './payment-gateway.interface';
import { PaymentGatewayService } from './payment-gateway.service';

@Module({})
export class PaymentGatewayModule {
  static register(options: PaymentGatewayModuleOptions): DynamicModule {
    return {
      global: true,

      module: PaymentGatewayModule,

      imports: options.imports ?? [],

      providers: [
        {
          provide: PaymentGatewayService,
          useExisting: options.provider,
        },
      ],

      exports: [PaymentGatewayService],
    };
  }
}
