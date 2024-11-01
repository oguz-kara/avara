import { PermissionResolver } from './permission.resolver'
import { RoleResolver } from './role.resolver'
import { UserAuthResolver } from './user-auth.resolver'
import { UserResolver } from './user.resolver'

export const Resolvers = [
  UserResolver,
  RoleResolver,
  PermissionResolver,
  UserAuthResolver,
]
