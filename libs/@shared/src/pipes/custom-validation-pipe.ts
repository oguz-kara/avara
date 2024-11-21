import { ValidationError } from 'class-validator'
import { ValidationPipe } from '@nestjs/common'

export class InputValidationError extends Error {
  constructor(message: any) {
    super(message)
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

  flattenValidationErrors(validationErrors: ValidationError[]) {
    const errors = []

    for (const error of validationErrors) {
      if (error.constraints) {
        for (const constraint of Object.values(error.constraints)) {
          errors.push({ message: constraint }) // Each message is pushed as an object
        }
      }

      if (error.children?.length) {
        errors.push(...this.flattenValidationErrors(error.children))
      }
    }

    return errors
  }
}
