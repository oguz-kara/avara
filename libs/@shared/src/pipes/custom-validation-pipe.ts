import {
  ValidationPipe,
  BadRequestException,
  ArgumentMetadata,
} from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { DomainValidationError } from '../errors/domain-validation.error'

class InputValidationError extends BadRequestException {
  constructor(message: any) {
    super(message, 'INVALID_INPUT')
    super.name = 'InputValidationError'
    super.stack = null
  }
}

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (validationErrors: ValidationError[]) => {
        const errors = this.flattenValidationErrors(validationErrors)
        return new InputValidationError(errors)
      },
    })
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    try {
      // Perform standard validation
      return await super.transform(value, metadata)
    } catch (err) {
      // Check if the error is a DomainValidationException
      if (err instanceof DomainValidationError) {
        throw err // Rethrow to be handled by global exception filter
      }
      throw err // Handle other validation errors as usual
    }
  }

  flattenValidationErrors(validationErrors: ValidationError[]) {
    const errors = []

    for (const error of validationErrors) {
      if (error.constraints) {
        errors.push({
          field: error.property,
          code: 'INVALID_INPUT', // Customize this as needed
          message: Object.values(error.constraints).join(', '), // Concatenate messages if multiple
        })
      }

      if (error.children?.length) {
        errors.push(...this.flattenValidationErrors(error.children))
      }
    }

    return errors
  }
}
