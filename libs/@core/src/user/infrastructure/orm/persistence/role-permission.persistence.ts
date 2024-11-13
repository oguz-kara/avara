import { RolePermission } from '@prisma/client'

export interface RolePermissionPersistence extends RolePermission {
  id: string | null
  role_id: string
  permission_id: string
  is_active: boolean
  created_at: Date
  created_by: string
  updated_at: Date
  updated_by: string
  deleted_at: Date
  deleted_by: string
}
