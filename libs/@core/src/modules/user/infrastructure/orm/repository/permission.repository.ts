import { Permission } from '@avara/core/modules/user/domain/entities/permission.entity'
import { ConflictException, Injectable } from '@nestjs/common'
import { TransactionAware } from '../../../../../../../@shared/src/database/transaction-aware.abstract'
import { NameFinderRepository } from '../../interfaces/name-finder'
import { Repository } from '../../../../../../../@shared/src/database/repository.interface'
import { PermissionMapper } from '../../mappers/permission.mapper'
import { DbService } from '../../../../../../../@shared/src/database/db-service'
import {
  PermissionArray,
  PermissionString,
} from '@avara/core/modules/user/api/types/permission.types'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/modules/user/api/types/pagination.type'
import { Ids } from '@avara/core/modules/user/api/types/filters.type'
import { ActionType, ResourceType, ScopeType } from '@prisma/client'

@Injectable()
export class PermissionRepository
  extends TransactionAware
  implements Repository<Permission>, NameFinderRepository<Permission>
{
  constructor(
    private readonly permissionMapper: PermissionMapper,
    private readonly db: DbService,
  ) {
    super()
  }

  getClient() {
    return this.transaction ? this.transaction : this.db
  }

  async findById(id: string): Promise<Permission | null> {
    const permission = await this.getClient().permission.findUnique({
      where: { id },
    })

    if (!permission) return null

    return this.permissionMapper.toDomain(permission)
  }

  async getPermissionsByRoleId(roleId: string): Promise<Permission[]> {
    const rolePermissions = await this.db.rolePermission.findMany({
      where: { role_id: roleId },
      select: {
        permission: true,
      },
    })

    const permissions = rolePermissions.map(({ permission }) =>
      this.permissionMapper.toDomain(permission),
    )

    return permissions
  }

  async findByName(
    permissionString: PermissionString,
  ): Promise<Permission | null> {
    const [action, resource, scope] = permissionString.split(
      ':',
    ) as PermissionArray

    const permission = await this.getClient().permission.findFirst({
      where: {
        action,
        scope: scope as ScopeType,
        resource,
      },
    })

    if (!permission) return null

    return this.permissionMapper.toDomain(permission)
  }

  async findAll(
    args: PaginationParams & Ids,
  ): Promise<PaginatedList<Permission>> {
    const { limit, position, ids } = args

    const total = await this.getClient().permission.count()

    const users = await this.getClient().permission.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      take: limit,
      skip: position,
    })

    return {
      items: users.map((permission) =>
        this.permissionMapper.toDomain(permission),
      ),
      pagination: {
        total,
        limit,
        position,
      },
    }
  }

  async remove(id: string): Promise<Permission | null> {
    const permission = await this.getClient().permission.findFirst({
      where: { id },
    })

    if (!permission) return null

    const removedPermission = await this.getClient().permission.delete({
      where: { id },
    })

    return this.permissionMapper.toDomain(removedPermission)
  }

  async save(permission: Permission): Promise<void> {
    const persistencePermission =
      this.permissionMapper.toPersistence(permission)

    if (permission.id) {
      await this.getClient().permission.update({
        where: { id: permission.id },
        data: {
          ...persistencePermission,
          scope: persistencePermission.scope as ScopeType,
          resource: persistencePermission.resource as ResourceType,
          action: persistencePermission.action as ActionType,
        },
      })
    } else {
      const createdPermission = await this.getClient().permission.create({
        data: {
          ...persistencePermission,
          scope: persistencePermission.scope as ScopeType,
          resource: persistencePermission.resource as ResourceType,
          action: persistencePermission.action as ActionType,
        },
      })

      if (!createdPermission.id)
        throw new ConflictException(
          'An error occurred when creating the permission!',
        )

      permission.assignId(createdPermission.id)
    }
  }
}
