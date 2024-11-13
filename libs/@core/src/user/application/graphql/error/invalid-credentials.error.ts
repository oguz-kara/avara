import { ErrorResult } from '@avara/shared/errors/error-result'
import { ObjectType } from '@nestjs/graphql'

@ObjectType()
export class InvalidCredentialsError extends ErrorResult {
  errorCode = 'INVALID_CREDENTIALS_ERROR'
  message = 'Invalid credentials!'
}
