import { registerAs } from '@nestjs/config';
import { validateObjectUsingClass } from 'src/utils/validator/object.validator';
import { AuthEnvSchema } from './auth-env.schema';

type Env = NodeJS.ProcessEnv & AuthEnvSchema;

export default registerAs('env-auth', () => {
  const env = process.env as Env;
  return validateObjectUsingClass(AuthEnvSchema, env);
});
