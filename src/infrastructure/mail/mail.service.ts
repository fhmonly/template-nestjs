import { ISendMailOptions } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
@Injectable()
export abstract class MailService {
  async send(options: ISendMailOptions) {}
}
