// cache.interface.ts

import { DynamicModule, Type } from '@nestjs/common';
import { CacheService } from './cache.service';

export interface CacheModuleOptions {
  imports?: DynamicModule[] | Type<any>[];

  provider: Type<CacheService>;
}
