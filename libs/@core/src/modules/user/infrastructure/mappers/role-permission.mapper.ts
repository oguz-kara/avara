import { RolePermissionPersistence } from '../orm/persistence/role-permission.persistence'
import { RolePermission } from '../../domain/entities/role-permission.entity'
import { Injectable } from '@nestjs/common'
import { Mapper } from '@avara/shared/database/mapper.interface'

@Injectable()
export class RolePermissionMapper
  implements Mapper<RolePermission, RolePermissionPersistence>
{
  toPersistence(rolePermission: RolePermission): RolePermissionPersistence {
    return {
      id: rolePermission.id,
      role_id: rolePermission.role_id,
      permission_id: rolePermission.permission_id,
      is_active: rolePermission.is_active,
      created_at: rolePermission.created_at,
      created_by: rolePermission.created_by,
      updated_at: rolePermission.updated_at,
      deleted_at: rolePermission.deleted_at,
      updated_by: rolePermission.updated_by,
      deleted_by: rolePermission.deleted_by,
    }
  }

  toDomain(raw: RolePermissionPersistence): RolePermission {
    return new RolePermission({
      id: raw.id,
      role_id: raw.role_id,
      is_active: raw.is_active,
      permission_id: raw.permission_id,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
      deleted_at: raw.deleted_at,
      created_by: raw.created_by,
      updated_by: raw.updated_by,
      deleted_by: raw.deleted_by,
    })
  }
}
