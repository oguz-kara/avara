import { AdministratorMapper } from './administrator.mapper'
import { PermissionMapper } from './permission.mapper'
import { RolePermissionMapper } from './role-permission.mapper'
import { RoleMapper } from './role.mapper'
import { UserMapper } from './user.mapper'

export const Mappers = [
  PermissionMapper,
  RoleMapper,
  RoleMapper,
  UserMapper,
  RolePermissionMapper,
  AdministratorMapper,
]
