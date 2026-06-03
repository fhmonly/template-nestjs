import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MidtransCoreAPIService } from './midtrans-core-api.service';
import midtransEnvConfig from './midtrans-env.config';
import { MidtransSnapService } from './midtrans-snap.service';
import { MidtransService } from './midtrans.service';

@Module({
  imports: [ConfigModule.forFeature(midtransEnvConfig)],
  providers: [MidtransService, MidtransSnapService, MidtransCoreAPIService],
  exports: [MidtransService],
})
export class MidtransModule {}
