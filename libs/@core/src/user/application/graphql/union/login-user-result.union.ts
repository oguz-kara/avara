import { createUnionType } from '@nestjs/graphql'
import { InvalidCredentialsError } from '../error/invalid-credentials.error'
import { AuthenticateUserSuccess } from '../../../infrastructure/graphql/auth.graphql'

export const LoginUserResult = createUnionType({
  name: 'LoginUserResult',
  types: () => [AuthenticateUserSuccess, InvalidCredentialsError] as const,
  resolveType(value) {
    if (value.token) {
      return AuthenticateUserSuccess
    }
    if (value instanceof InvalidCredentialsError) {
      return InvalidCredentialsError
    }
    return null
  },
})
