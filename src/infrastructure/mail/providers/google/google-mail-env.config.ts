import { registerAs } from '@nestjs/config';
import { validateObjectUsingClass } from 'src/utils/validator/object.validator';
import { GoogleMailEnv } from './google-mail-env.schema';

export default registerAs('env-google-mail', () =>
  validateObjectUsingClass(GoogleMailEnv, process.env),
);
