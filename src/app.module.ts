import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { MySQLDatabaseModule } from './database/drivers/mysql/mysql.module';
import { MySQLDatabaseService } from './database/drivers/mysql/mysql.service';
import { PaymentGatewayModule } from './lib/payment-gateway/payment-gateway.module';
import { MidtransModule } from './lib/payment-gateway/providers/midtrans/midtrans.module';
import { MidtransService } from './lib/payment-gateway/providers/midtrans/midtrans.service';
import { AuthModule } from './modules/auth/auth.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    // *============= Lib Modules ================
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60_000,
          limit: 100,
        },
      ],
    }),
    DatabaseModule.register({
      imports: [MySQLDatabaseModule],
      provider: MySQLDatabaseService,
    }),
    // CacheModule.register({
    //   imports: [RedisCacheModule],
    //   provider: RedisCacheService,
    // }),
    PaymentGatewayModule.register({
      imports: [MidtransModule],
      provider: MidtransService,
    }),
    // !============= End Lib Modules ================

    // *============= Route Modules ================
    AuthModule,
    PaymentModule,
    // !============= End Route Modules ================
  ],
  controllers: [AppController],
})
export class AppModule {}
