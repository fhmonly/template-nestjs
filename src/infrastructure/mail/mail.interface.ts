import { DynamicModule, Type } from '@nestjs/common';
import { MailService } from './mail.service';

export interface SendMailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

export interface MailModuleOptions {
  imports?: DynamicModule[] | Type<any>[];

  provider: Type<MailService>;
}
