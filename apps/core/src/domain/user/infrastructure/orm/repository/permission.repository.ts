import { Permission } from '@avara/core/domain/user/domain/entities/permission.entity'
import { ConflictException, Injectable } from '@nestjs/common'
import { NameFinder } from '../../interfaces/name-finder'
import { PermissionMapper } from '../../mappers/permission.mapper'
import { DbService } from '../../../../../../../../libs/@shared/src/database/db-service'
import {
  PermissionArray,
  PermissionString,
} from '@avara/core/domain/user/api/types/permission.types'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/domain/user/api/types/pagination.type'
import { Ids } from '@avara/core/domain/user/api/types/filters.type'
import { ActionType, ResourceType, ScopeType } from '@prisma/client'
import {
  ChannelResourceFinder,
  ChannelResourceRemover,
  ChannelResourceSaver,
  ContextSaver,
  PersistenceContext,
} from '@avara/core/database/channel-aware-repository.interface'
import { PrismaClient } from '@prisma/client'
import { TransactionAware } from '@avara/shared/database/transaction-aware.abstract'
import { DbTransactionalClient } from '@avara/shared/database/db-transactional-client'

@Injectable()
export class PermissionRepository
  extends ContextSaver
  implements
    ChannelResourceFinder<Permission>,
    ChannelResourceRemover<Permission>,
    ChannelResourceSaver<Permission>,
    NameFinder<Permission>,
    TransactionAware
{
  transaction: DbTransactionalClient | null = null

  constructor(
    private readonly permissionMapper: PermissionMapper,
    private readonly db: DbService,
  ) {
    super()
  }

  setTransactionObject(transaction: DbTransactionalClient): void {
    this.transaction = transaction
  }

  getClient(tx?: DbTransactionalClient): DbTransactionalClient | PrismaClient {
    return tx ? tx : this.transaction ? this.transaction : this.db
  }

  async findOneInChannel(
    id: string,
    persistenceContext?: PersistenceContext,
  ): Promise<Permission | null> {
    const permission = await this.getClient(
      persistenceContext?.tx,
    ).permission.findUnique({
      where: { id, channels: { some: { id: this.ctx.channelId } } },
    })

    if (!permission) return null

    return this.permissionMapper.toDomain(permission)
  }

  async getPermissionsByRoleId(
    roleId: string,
    persistenceContext?: PersistenceContext,
  ): Promise<Permission[]> {
    const rolePermissions = await this.getClient(
      persistenceContext?.tx,
    ).rolePermission.findMany({
      where: {
        roleId: roleId,
        channels: { some: { id: this.ctx.channelId } },
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
    persistenceContext?: PersistenceContext,
  ): Promise<Permission | null> {
    const [action, resource, scope] = permissionString.split(
      ':',
    ) as PermissionArray

    const permission = await this.getClient(
      persistenceContext?.tx,
    ).permission.findFirst({
      where: {
        action,
        scope: scope as ScopeType,
        resource: resource as ResourceType,
        channels: {
          some: {
            id: this.ctx.channelId,
          },
        },
      },
    })

    if (!permission) return null

    return this.permissionMapper.toDomain(permission)
  }

  async findManyInChannel(
    args: PaginationParams & Ids,
    persistenceContext?: PersistenceContext,
  ): Promise<PaginatedList<Permission>> {
    const { limit, position, ids } = args

    const total = await this.getClient(
      persistenceContext?.tx,
    ).permission.count()

    const users = await this.getClient(
      persistenceContext?.tx,
    ).permission.findMany({
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
                id: this.ctx.channelId,
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

  async removeResourceInChannel(
    resource: Permission,
    persistenceContext?: PersistenceContext,
  ): Promise<void> {
    const { id } = resource

    const permission = await this.getClient(
      persistenceContext?.tx,
    ).permission.findFirst({
      where: { id, channels: { some: { id: this.ctx.channelId } } },
    })

    if (!permission) throw new ConflictException('Permission not found!')

    await this.getClient(persistenceContext?.tx).permission.delete({
      where: { id },
    })
  }

  async saveResourceToChannel(
    permission: Permission,
    persistenceContext?: PersistenceContext,
  ): Promise<void> {
    const persistencePermission =
      this.permissionMapper.toPersistence(permission)

    if (permission.id) {
      await this.getClient(persistenceContext?.tx).permission.update({
        where: {
          id: permission.id,
          channels: { some: { id: this.ctx.channelId } },
        },
        data: {
          ...persistencePermission,
          scope: persistencePermission.scope as ScopeType,
          resource: persistencePermission.resource as ResourceType,
          action: persistencePermission.action as ActionType,
          channels: {
            connect: {
              id: this.ctx.channelId,
            },
          },
        },
      })
    } else {
      const createdPermission = await this.getClient(
        persistenceContext?.tx,
      ).permission.create({
        data: {
          ...persistencePermission,
          scope: persistencePermission.scope as ScopeType,
          resource: persistencePermission.resource as ResourceType,
          action: persistencePermission.action as ActionType,
          channels: {
            connect: {
              id: this.ctx.channelId,
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
