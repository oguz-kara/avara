import { ValidationError } from '@nestjs/common'
import { validate, validateSync } from 'class-validator'
import { DomainValidationError } from '../errors/domain-validation.error'
import { CoreEntity } from './core-entity.abstract'

export abstract class ValidateAbleCoreEntity extends CoreEntity {
  protected _errors: ValidationError[] = []

  get errors(): ValidationError[] {
    return this._errors
  }

  get hasErrors(): boolean {
    return this._errors.length > 0
  }

  addError(error: ValidationError): void {
    this._errors.push(error)
  }

  clearErrors(): void {
    this._errors = []
  }

  protected async validate(entityName: string) {
    const errors: ValidationError[] = await validate(this)
    if (errors.length > 0) {
      throw new DomainValidationError(entityName, errors)
    }
  }

  protected validateSync(entityName: string) {
    const errors: ValidationError[] = validateSync(this)
    if (errors.length > 0) {
      throw new DomainValidationError(entityName, errors)
    }
  }
}
