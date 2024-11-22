import { RolePermission } from '@prisma/client'

export interface RolePermissionPersistence extends RolePermission {
  id: string | null
  roleId: string
  permissionId: string
  isActive: boolean
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
  deletedAt: Date
  deletedBy: string
}
