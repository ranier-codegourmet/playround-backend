import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export const AtLeastOneFieldRequired = (
  propertyNames: string[],
  validationOptions?: ValidationOptions
) => {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'atLeastOneFieldRequired',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [propertyNames],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [properties] = args.constraints;
          const object = args.object as any;
          return properties.some((property) => object[property] != null);
        },
        defaultMessage(args: ValidationArguments) {
          return `At least one of the following fields must be provided: ${args.constraints[0].join(
            ', '
          )}`;
        },
      },
    });
  };
};
