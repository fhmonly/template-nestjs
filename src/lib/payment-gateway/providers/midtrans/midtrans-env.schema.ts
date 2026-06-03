import { plainToInstance, Transform } from 'class-transformer';
import { IsBoolean, IsString, validateSync } from 'class-validator';

export class MidtransEnvSchema {
  @IsString()
  MIDTRANS_SERVER_KEY!: string;

  @IsBoolean()
  @Transform(
    ({ value }) =>
      (value as string | undefined)?.toLocaleLowerCase() === 'true',
  )
  MIDTRANS_IS_PRODUCTION!: boolean;
}

export function validateMidtransEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(MidtransEnvSchema, config, {
    enableImplicitConversion: false,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
