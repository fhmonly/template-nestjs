// cache.module.ts

import { DynamicModule, Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheInterceptor } from './cache.interceptor';
import { CacheModuleOptions } from './cache.interface';
import { CacheService } from './cache.service';

@Global()
@Module({})
export class CacheModule {
  static register(options: CacheModuleOptions): DynamicModule {
    return {
      module: CacheModule,

      imports: options.imports ?? [],

      providers: [
        {
          provide: CacheService,
          useExisting: options.provider,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: CacheInterceptor,
        },
      ],

      exports: [CacheService],
    };
  }
}
