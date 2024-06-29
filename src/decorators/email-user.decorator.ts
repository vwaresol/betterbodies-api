import { ValidationOptions, registerDecorator } from 'class-validator';
import { EmailExistRule } from 'src/validator/email-exist.validator';

export function UserEmailExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'userEmailExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: EmailExistRule,
    });
  };
}
