import { DynamicModule, Module } from '@nestjs/common';

import { MAIL_SERVICE } from './constants';
import { handlebarsSetup } from './handlebars.utils';
import { MailModuleOptions } from './mail.interface';

handlebarsSetup();

@Module({})
export class MailModule {
  static register(options: MailModuleOptions): DynamicModule {
    return {
      global: true,

      module: MailModule,

      imports: options.imports ?? [],

      providers: [
        {
          provide: MAIL_SERVICE,
          useExisting: options.provider,
        },
      ],

      exports: [MAIL_SERVICE],
    };
  }
}
