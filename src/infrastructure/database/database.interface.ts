import { DynamicModule, Type } from '@nestjs/common';
import { DatabaseService } from './database.service';

export interface DatabaseModuleOptions {
  imports?: DynamicModule[] | Type<any>[];

  provider: Type<DatabaseService>;
}
