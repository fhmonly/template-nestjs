// cache.service.ts
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class RedisCacheService extends CacheService {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  get redis(): Redis | null {
    return this.redisService.getOrNil();
  }

  async getVersion(resource: string): Promise<number> {
    const v = await this.redis?.get(`${resource}:version`);
    return Number(v) || 1;
  }

  async bumpVersion(resource: string) {
    await this.redis?.incr(`${resource}:version`);
  }

  buildKey(resource: string, version: number, suffix: string) {
    return `${resource}:v${version}:${suffix}`;
  }

  async get<T>(key: string): Promise<T | null> {
    const val = await this.redis?.get(key);
    return val ? JSON.parse(val) : null;
  }

  async set(key: string, value: any, ttl = 60) {
    await this.redis?.set(key, JSON.stringify(value), 'EX', ttl);
  }

  // lock (anti stampede)
  async acquireLock(key: string, ttl = 5): Promise<boolean> {
    const res = await this.redis?.set(`lock:${key}`, '1', 'EX', ttl, 'NX');
    return res === 'OK';
  }

  async releaseLock(key: string) {
    await this.redis?.del(`lock:${key}`);
  }
}
