import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { join } from 'path';
import { defaultHandleBarsAdapter } from '../../handlebars.utils';
import googleMailEnvConfig from './google-mail-env.config';
import { GoogleMailService } from './google-mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule.forFeature(googleMailEnvConfig)],
      inject: [googleMailEnvConfig.KEY],

      useFactory: (configService: ConfigType<typeof googleMailEnvConfig>) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,

          auth: {
            user: configService.GMAIL_USER,
            pass: configService.GMAIL_SECRET_KEY,
          },
        },

        defaults: {
          from: `"No Reply" <${configService.GMAIL_USER}>`,
        },

        template: {
          dir: join(__dirname, '../..', 'templates'),
          adapter: defaultHandleBarsAdapter,
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [GoogleMailService],
  exports: [GoogleMailService],
})
export class GoogleMailModule {}
