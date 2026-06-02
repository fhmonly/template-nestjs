import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MySQLDatabaseModule } from './database/drivers/mysql/mysql.module';
import { MySQLDatabaseService } from './database/drivers/mysql/mysql.service';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60_000,
          limit: 100,
        },
      ],
    }),
    ConfigModule,
    DatabaseModule.register({
      imports: [MySQLDatabaseModule],
      provider: MySQLDatabaseService,
    }),
    // CacheModule.register({
    //   imports: [RedisCacheModule],
    //   provider: RedisCacheService,
    // }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
