// cache.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const CACHE_KEY = 'cache:key';

export interface CacheOptions {
  resource: string; // e.g. 'user'
  ttl?: number; // seconds
}

export const Cacheable = (options: CacheOptions) =>
  SetMetadata(CACHE_KEY, options);
