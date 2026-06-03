import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
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
})
export class AppModule {}
