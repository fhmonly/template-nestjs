import { DynamicModule, Module } from '@nestjs/common';
import { DATABASE_SERVICE } from './constants';
import { DatabaseModuleOptions } from './database.interface';

@Module({})
export class DatabaseModule {
  static register(options: DatabaseModuleOptions): DynamicModule {
    return {
      global: true,

      module: DatabaseModule,

      imports: options.imports ?? [],

      providers: [
        {
          provide: DATABASE_SERVICE,
          useExisting: options.provider,
        },
      ],

      exports: [DATABASE_SERVICE],
    };
  }
}
