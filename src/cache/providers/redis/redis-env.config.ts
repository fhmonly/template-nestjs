import { registerAs } from '@nestjs/config';
import { validateObjectUsingClass } from 'src/utils/validator/object.validator';
import { RedisEnvSchema } from './redis-env.schema';

export default registerAs('env-redis', () =>
  validateObjectUsingClass(RedisEnvSchema, process.env),
);
