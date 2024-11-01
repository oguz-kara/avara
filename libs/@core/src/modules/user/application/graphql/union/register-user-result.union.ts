import { createUnionType } from '@nestjs/graphql'
import { UserType } from '../../../infrastructure/graphql/user.graphql'
import { UserWithEmailAlreadyExistsError } from '../error/user-with-email-already-exists.error'
import { CreateUserAccountSuccess } from '../../../infrastructure/graphql/auth.graphql'

export const RegisterUserResult = createUnionType({
  name: 'RegisterUserResult',
  types: () => [CreateUserAccountSuccess] as const,
  resolveType(value) {
    if (value instanceof UserType) {
      return UserType
    }
    if (value instanceof UserWithEmailAlreadyExistsError) {
      return UserWithEmailAlreadyExistsError
    }
    return null
  },
})
