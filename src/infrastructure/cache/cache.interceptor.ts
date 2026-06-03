// cache.interceptor.ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, from, lastValueFrom } from 'rxjs';
import { CACHE_KEY, CacheOptions } from './cache.decorator';
import { CacheService } from './cache.service';
import { stableHash } from './cache.utils';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    private cache: CacheService,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const options = this.reflector.getAllAndOverride<CacheOptions>(CACHE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!options) return next.handle();

    const request = context.switchToHttp().getRequest();

    if (request.method !== 'GET') return next.handle();

    return from(this.handleRequest(request, options, next));
  }

  private async handleRequest(req, options: CacheOptions, next: CallHandler) {
    const { resource, ttl = 60 } = options;

    const version = await this.cache.getVersion(resource);

    const queryHash = stableHash(req.query);

    const key = this.cache.buildKey(
      resource,
      version,
      `path:${req.route.path}:q:${queryHash}`,
    );

    // 1. try cache
    const cached = await this.cache.get(key);

    if (cached) return cached;

    // 2. lock (prevent stampede)
    const locked = await this.cache.acquireLock(key);

    // if "Another request is currently building the cache.", try again
    if (!locked) {
      for (let i = 0; i < 5; i++) {
        await new Promise((r) => setTimeout(r, 20 * (i + 1))); // backoff

        const cached = await this.cache.get(key);
        if (cached) return cached;
      }
      return await lastValueFrom(next.handle());
    }

    try {
      const data = await lastValueFrom(next.handle());

      await this.cache.set(key, data, ttl);

      return data;
    } finally {
      await this.cache.releaseLock(key);
    }
  }
}
