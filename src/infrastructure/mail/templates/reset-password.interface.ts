import { BaseTemplateContext } from '../template.interface';

export interface TemplateResetPasswordContext extends BaseTemplateContext {
  resetPasswordUrl: string;
  expiresIn: string;
}
