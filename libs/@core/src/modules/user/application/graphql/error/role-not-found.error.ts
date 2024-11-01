import { ErrorResult } from '@avara/shared/errors/error-result'
import { ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RoleNotFoundError extends ErrorResult {
  errorCode = 'ROLE_NOT_FOUND_ERROR'
  message = 'Role not found!'
}
