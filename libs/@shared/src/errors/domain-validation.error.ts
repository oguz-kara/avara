import { ValidationError } from 'class-validator'

export class DomainValidationError extends Error {
  public readonly errors: ValidationError[]

  constructor(entityName: string, errors: ValidationError[]) {
    super(`Validation failed for ${entityName}`)
    this.name = 'DomainValidationError'
    this.errors = errors
  }

  public formatErrors(): Record<string, any> {
    return this.errors.map((error) => ({
      property: error.property,
      constraints: error.constraints,
      children: error.children
        ? this.formatChildren(error.children)
        : undefined,
    }))
  }

  private formatChildren(children: ValidationError[]): any[] {
    return children.map((child) => ({
      property: child.property,
      constraints: child.constraints,
      children: child.children
        ? this.formatChildren(child.children)
        : undefined,
    }))
  }
}
