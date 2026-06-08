import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import { MailService } from '../../mail.service';
import {
  BaseTemplateContext,
  RequiredMailOptions,
} from '../../template.interface';

type SendMailOptions<T extends BaseTemplateContext = BaseTemplateContext> =
  Omit<ISendMailOptions, 'context' | 'template'> & {
    context: Omit<T, 'year'> & Record<string, any>;
  } & RequiredMailOptions;

@Injectable()
export class GoogleMailService extends MailService {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async send<C extends BaseTemplateContext = BaseTemplateContext>(
    options: SendMailOptions<C>,
  ): Promise<void> {
    const { context, ...restOpt } = options;
    await this.mailerService.sendMail({
      context: {
        year: new Date().getFullYear(),
        ...context,
      },
      ...restOpt,
    });
  }
}
