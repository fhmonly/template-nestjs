import { registerAs } from '@nestjs/config';
import { validateObjectUsingClass } from 'src/utils/validator/object.validator';
import { CacheEnvSchema } from './cache-env.schema';

export default registerAs('env-redis', () =>
  validateObjectUsingClass(CacheEnvSchema, process.env),
);
