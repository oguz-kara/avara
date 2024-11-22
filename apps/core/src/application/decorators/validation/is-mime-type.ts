import { supportedTypes } from '@avara/core/config/file-types.config'
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ async: false })
export class IsMimeTypeConstraint implements ValidatorConstraintInterface {
  validate(value: string): boolean {
    const allSupportedTypes = Object.values(supportedTypes).flat()
    return allSupportedTypes.includes(value)
  }

  defaultMessage(): string {
    return 'Invalid MIME type'
  }
}

export function IsMimeType(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMimeTypeConstraint,
    })
  }
}
