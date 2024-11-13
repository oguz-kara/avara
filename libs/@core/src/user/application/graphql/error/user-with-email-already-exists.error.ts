import { ErrorResult } from '@avara/shared/errors/error-result'
import { ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserWithEmailAlreadyExistsError extends ErrorResult {
  errorCode = 'USER_WITH_EMAIL_ALREADY_EXISTS_ERROR'
  message = 'User with email already exists!'
}
