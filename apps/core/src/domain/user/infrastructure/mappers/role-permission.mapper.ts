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
      roleId: rolePermission.roleId,
      permissionId: rolePermission.permissionId,
      isActive: rolePermission.isActive,
      createdAt: rolePermission.createdAt,
      createdBy: rolePermission.createdBy,
      updatedAt: rolePermission.updatedAt,
      deletedAt: rolePermission.deletedAt,
      updatedBy: rolePermission.updatedBy,
      deletedBy: rolePermission.deletedBy,
    }
  }

  toDomain(raw: RolePermissionPersistence): RolePermission {
    return new RolePermission({
      id: raw.id,
      roleId: raw.roleId,
      isActive: raw.isActive,
      permissionId: raw.permissionId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
      createdBy: raw.createdBy,
      updatedBy: raw.updatedBy,
      deletedBy: raw.deletedBy,
    })
  }
}
