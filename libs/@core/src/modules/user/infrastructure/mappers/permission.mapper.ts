import { Injectable } from '@nestjs/common'
import { Permission } from '../../domain/entities/permission.entity'
import { PermissionPersistence } from '../orm/persistence/permission.persistence'
import { Mapper } from '@avara/shared/database/mapper.interface'
import { ActionType, ResourceType, ScopeType } from '../../application/enums'

@Injectable()
export class PermissionMapper
  implements Mapper<Permission, PermissionPersistence>
{
  toDomain(entity: PermissionPersistence): Permission {
    return new Permission({
      id: entity.id,
      resource: entity.resource as ResourceType,
      action: entity.action as ActionType,
      scope: entity.scope as ScopeType,
      created_by: entity.created_by,
      updated_by: entity.updated_by,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      deleted_at: entity.deleted_at,
      specific_scope_id: entity.specific_scope_id,
    })
  }

  toPersistence(entity: Permission): PermissionPersistence {
    return {
      id: entity.id,
      resource: entity.resource,
      action: entity.action,
      scope: entity.scope,
      created_by: entity.created_by,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      updated_by: entity.updated_by,
      deleted_at: entity.deleted_at,
      deleted_by: entity.deleted_by,
      specific_scope_id: entity.specific_scope_id,
    }
  }
}
