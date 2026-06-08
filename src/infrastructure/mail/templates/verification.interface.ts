import { BaseTemplateContext } from '../template.interface';

export interface TemplateVerificationContext extends BaseTemplateContext {
  verificationUrl: string;
  expiresIn: string;
}
