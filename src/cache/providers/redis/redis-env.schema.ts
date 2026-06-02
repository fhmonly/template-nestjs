import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';
import { CacheEnvSchema } from 'src/cache/cache-env.schema';

export class RedisEnvSchema extends CacheEnvSchema {
  @IsString()
  REDIS_HOST!: string;

  @Type(() => Number)
  @IsInt()
  REDIS_PORT!: number;

  @IsString()
  REDIS_PASSWORD!: string;
}
