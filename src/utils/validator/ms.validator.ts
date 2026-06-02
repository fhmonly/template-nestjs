import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import ms from 'ms';

export function IsMsString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isMsString',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== 'string') {
            return false;
          }

          try {
            return typeof ms(value as ms.StringValue) === 'number';
          } catch {
            return false;
          }
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ms duration`;
        },
      },
    });
  };
}
