// cache.service.abstract.ts

export abstract class CacheService {
  abstract getVersion(resource: string): Promise<number>;

  abstract bumpVersion(resource: string): Promise<void>;

  abstract buildKey(resource: string, version: number, suffix: string): string;

  abstract get<T>(key: string): Promise<T | null>;

  abstract set(key: string, value: unknown, ttl?: number): Promise<void>;

  abstract acquireLock(key: string, ttl?: number): Promise<boolean>;

  abstract releaseLock(key: string): Promise<void>;
}
