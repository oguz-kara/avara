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
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
      specificScopeId: entity.specificScopeId,
    })
  }

  toPersistence(entity: Permission): PermissionPersistence {
    return {
      id: entity.id,
      resource: entity.resource,
      action: entity.action,
      scope: entity.scope,
      createdBy: entity.createdBy,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      updatedBy: entity.updatedBy,
      deletedAt: entity.deletedAt,
      deletedBy: entity.deletedBy,
      specificScopeId: entity.specificScopeId,
    }
  }
}
