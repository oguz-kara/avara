import { Permission } from '@avara/core/user/domain/entities/permission.entity'
import { ConflictException, Injectable } from '@nestjs/common'
import { NameFinder } from '../../interfaces/name-finder'
import { PermissionMapper } from '../../mappers/permission.mapper'
import { DbService } from '../../../../../../@shared/src/database/db-service'
import {
  PermissionArray,
  PermissionString,
} from '@avara/core/user/api/types/permission.types'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/user/api/types/pagination.type'
import { Ids } from '@avara/core/user/api/types/filters.type'
import { ActionType, ResourceType, ScopeType } from '@prisma/client'
import {
  ChannelResourceFinder,
  ChannelResourceRemover,
  ChannelResourceSaver,
  ContextSaver,
} from '@avara/shared/database/channel-aware-repository.interface'

@Injectable()
export class PermissionRepository
  extends ContextSaver
  implements
    ChannelResourceFinder<Permission>,
    ChannelResourceRemover<Permission>,
    ChannelResourceSaver<Permission>,
    NameFinder<Permission>
{
  constructor(
    private readonly permissionMapper: PermissionMapper,
    private readonly db: DbService,
  ) {
    super()
  }

  async findOneInChannel(id: string): Promise<Permission | null> {
    const permission = await this.db.permission.findUnique({
      where: { id, channels: { some: { id: this.ctx.channel_id } } },
    })

    if (!permission) return null

    return this.permissionMapper.toDomain(permission)
  }

  async getPermissionsByRoleId(roleId: string): Promise<Permission[]> {
    const rolePermissions = await this.db.rolePermission.findMany({
      where: {
        role_id: roleId,
        channels: { some: { id: this.ctx.channel_id } },
      },
      select: {
        permission: true,
      },
    })

    const permissions = rolePermissions.map(({ permission }) =>
      this.permissionMapper.toDomain(permission),
    )

    return permissions
  }

  async findOneByNameInChannel(
    permissionString: PermissionString,
  ): Promise<Permission | null> {
    const [action, resource, scope] = permissionString.split(
      ':',
    ) as PermissionArray

    const permission = await this.db.permission.findFirst({
      where: {
        action,
        scope: scope as ScopeType,
        resource: resource as ResourceType,
        channels: {
          some: {
            id: this.ctx.channel_id,
          },
        },
      },
    })

    if (!permission) return null

    return this.permissionMapper.toDomain(permission)
  }

  async findManyInChannel(
    args: PaginationParams & Ids,
  ): Promise<PaginatedList<Permission>> {
    const { limit, position, ids } = args

    const total = await this.db.permission.count()

    const users = await this.db.permission.findMany({
      where: {
        AND: [
          {
            id: {
              in: ids,
            },
          },
          {
            channels: {
              some: {
                id: this.ctx.channel_id,
              },
            },
          },
        ],
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

  async removeResourceInChannel(resource: Permission): Promise<void> {
    const { id } = resource

    const permission = await this.db.permission.findFirst({
      where: { id, channels: { some: { id: this.ctx.channel_id } } },
    })

    if (!permission) throw new ConflictException('Permission not found!')

    await this.db.permission.delete({
      where: { id },
    })
  }

  async saveResourceToChannel(permission: Permission): Promise<void> {
    const persistencePermission =
      this.permissionMapper.toPersistence(permission)

    if (permission.id) {
      await this.db.permission.update({
        where: {
          id: permission.id,
          channels: { some: { id: this.ctx.channel_id } },
        },
        data: {
          ...persistencePermission,
          scope: persistencePermission.scope as ScopeType,
          resource: persistencePermission.resource as ResourceType,
          action: persistencePermission.action as ActionType,
          channels: {
            connect: {
              id: this.ctx.channel_id,
            },
          },
        },
      })
    } else {
      const createdPermission = await this.db.permission.create({
        data: {
          ...persistencePermission,
          scope: persistencePermission.scope as ScopeType,
          resource: persistencePermission.resource as ResourceType,
          action: persistencePermission.action as ActionType,
          channels: {
            connect: {
              id: this.ctx.channel_id,
            },
          },
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
