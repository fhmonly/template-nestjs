import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { DatabaseModule } from './infrastructure/database/database.module';
import { MySQLDatabaseModule } from './infrastructure/database/drivers/mysql/mysql.module';
import { MySQLDatabaseService } from './infrastructure/database/drivers/mysql/mysql.service';
import { AuthModule } from './modules/auth/auth.module';

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
    // !============= End Lib Modules ================

    // *============= Route Modules ================
    AuthModule,
    // !============= End Route Modules ================
  ],
  controllers: [AppController],
})
export class AppModule {}
