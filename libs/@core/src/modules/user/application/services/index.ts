import { AuthStorageService } from './auth-storage.service'
import { PermissionService } from './permission.service'
import { RolePermissionService } from './role-permission.service'
import { RoleService } from './role.service'
import { AuthService } from './auth.service'
import { UserService } from './user.service'

export const Services = [
  RoleService,
  UserService,
  PermissionService,
  RolePermissionService,
  AuthService,
  AuthStorageService,
]
