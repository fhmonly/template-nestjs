import { Type } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

export class RedisEnvSchema {
  @IsString()
  REDIS_HOST!: string;

  @Type(() => Number)
  @IsInt()
  REDIS_PORT!: number;

  @IsString()
  REDIS_PASSWORD!: string;
}
