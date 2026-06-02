import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { RedisCacheService } from './redis-cache.service';
import redisEnvConfig from './redis-env.config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule.forFeature(redisEnvConfig)],
      inject: [redisEnvConfig.KEY],
      useFactory: (configService): RedisModuleOptions => {
        const config = configService as ConfigType<typeof redisEnvConfig>;
        return {
          config: {
            host: config.REDIS_HOST,
            port: config.REDIS_PORT,
            password: config.REDIS_PASSWORD,
            db: 0,
          },
        };
      },
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
