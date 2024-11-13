import { AdministratorRepository } from './administrator.repository'
import { PermissionRepository } from './permission.repository'
import { RolePermissionRepository } from './role-permission.repository'
import { RoleRepository } from './role.repository'
import { UserRepository } from './user.repository'

export const Repositories = [
  RoleRepository,
  UserRepository,
  PermissionRepository,
  RolePermissionRepository,
  AdministratorRepository,
]
