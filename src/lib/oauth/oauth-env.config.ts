import { registerAs } from '@nestjs/config';
import { validateObjectUsingClass } from 'src/utils/validator/object.validator';
import { OAuthEnvSchema } from './oauth-env.schema';

export default registerAs('oauth-env', () =>
  validateObjectUsingClass(OAuthEnvSchema, process.env),
);
