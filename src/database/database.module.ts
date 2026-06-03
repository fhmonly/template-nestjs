import { DynamicModule, Module } from '@nestjs/common';
import { DatabaseModuleOptions } from './database.interface';
import { DatabaseService } from './database.service';

@Module({})
export class DatabaseModule {
  static register(options: DatabaseModuleOptions): DynamicModule {
    return {
      global: true,

      module: DatabaseModule,

      imports: options.imports ?? [],

      providers: [
        {
          provide: DatabaseService,
          useExisting: options.provider,
        },
      ],

      exports: [DatabaseService],
    };
  }
}
