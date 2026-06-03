import { registerAs } from '@nestjs/config';
import { ApiConfigOptions } from 'midtrans-client';
import { validateObjectUsingClass } from 'src/utils/validator/object.validator';
import { MidtransEnvSchema } from './midtrans-env.schema';

export default registerAs('env-midtrans', () => {
  const config = validateObjectUsingClass(MidtransEnvSchema, process.env);
  return {
    serverKey: config.MIDTRANS_SERVER_KEY,
    isProduction: config.MIDTRANS_IS_PRODUCTION,
  } as ApiConfigOptions;
});
