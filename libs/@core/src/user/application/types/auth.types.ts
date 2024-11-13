import { AuthenticateUserSuccess as AuthenticateUserSuccess } from '../../infrastructure/graphql/auth.graphql'
import { UserType } from '../../infrastructure/graphql/user.graphql'
import { InvalidCredentialsError } from '../graphql/error/invalid-credentials.error'
import { RoleNotFoundError } from '../graphql/error/role-not-found.error'
import { UserWithEmailAlreadyExistsError } from '../graphql/error/user-with-email-already-exists.error'

export type AuthenticateUserResult =
  | AuthenticateUserSuccess
  | InvalidCredentialsError

export type CreateUserAccountResult =
  | UserType
  | RoleNotFoundError
  | UserWithEmailAlreadyExistsError
