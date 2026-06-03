import { registerAs } from '@nestjs/config';
import { validateObjectUsingClass } from 'src/utils/validator/object.validator';
import { DatabaseEnvSchema } from './database-env.schema';

export default registerAs('env-database', () =>
  validateObjectUsingClass(DatabaseEnvSchema, process.env),
);
