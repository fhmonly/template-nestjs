export interface BaseTemplateContext {
  appName: string;
  year: number;
  title: string;
}

export type RequiredMailOptions = {
  to: string;
  subject: string;
  template: MailTemplate;
};

export type MailTemplate = 'verification' | 'reset-password';
