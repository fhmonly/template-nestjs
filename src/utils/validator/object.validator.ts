import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync, ValidatorOptions } from 'class-validator';

export function validateObjectUsingClass<T>(
  cls: ClassConstructor<T>,
  plainObject: Record<string, unknown>,
  validatorOptions?: ValidatorOptions,
): T {
  const validatedConfig = plainToInstance(cls, plainObject, {
    enableImplicitConversion: false,
  });

  const errors = validateSync(validatedConfig as object, {
    skipMissingProperties: false,
    ...validatorOptions,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
