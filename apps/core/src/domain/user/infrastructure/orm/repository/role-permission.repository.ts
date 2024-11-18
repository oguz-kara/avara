import { ConflictException, Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

import { RolePermissionMapper } from '../../mappers/role-permission.mapper'
import { RolePermission } from '@avara/core/domain/user/domain/entities/role-permission.entity'
import { DbService } from '../../../../../../../../libs/@shared/src/database/db-service'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/domain/user/api/types/pagination.type'
import {
  ChannelResourceFinder,
  ChannelResourceRemover,
  ChannelResourceSaver,
  ContextSaver,
  PersistenceContext,
} from '@avara/core/database/channel-aware-repository.interface'
import { DbTransactionalClient } from '@avara/shared/database/db-transactional-client'
import { TransactionAware } from '@avara/shared/database/transaction-aware.abstract'

@Injectable()
export class RolePermissionRepository
  extends ContextSaver
  implements
    ChannelResourceFinder<RolePermission>,
    ChannelResourceRemover<RolePermission>,
    ChannelResourceSaver<RolePermission>,
    TransactionAware
{
  transaction: DbTransactionalClient | null = null

  constructor(
    private readonly rolePermissionMapper: RolePermissionMapper,
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
  ): Promise<RolePermission | null> {
    const rolePermission = await this.getClient(
      persistenceContext?.tx,
    ).rolePermission.findUnique({
      where: { id, channels: { some: { id: this.ctx.channel_id } } },
      include: { role: true, permission: true },
    })

    if (!rolePermission) return null

    return this.rolePermissionMapper.toDomain(rolePermission)
  }

  async findByRoleId(
    role_id: string,
    persistenceContext?: PersistenceContext,
  ): Promise<RolePermission[]> {
    const rolePermissions = await this.getClient(
      persistenceContext?.tx,
    ).rolePermission.findMany({
      where: { role_id, channels: { some: { id: this.ctx.channel_id } } },
      include: { permission: true, role: true },
    })

    return rolePermissions.map((rolePermission) =>
      this.rolePermissionMapper.toDomain(rolePermission),
    )
  }

  async findManyInChannel(
    args: PaginationParams,
    persistenceContext?: PersistenceContext,
  ): Promise<PaginatedList<RolePermission>> {
    const { limit, position } = args

    const total = await this.getClient(
      persistenceContext?.tx,
    ).rolePermission.count()

    const rolePermissions = await this.getClient(
      persistenceContext?.tx,
    ).rolePermission.findMany({
      where: { channels: { some: { id: this.ctx.channel_id } } },
      take: limit,
      skip: position,
      include: {
        permission: true,
        role: true,
      },
    })

    return {
      items: rolePermissions.map((rolePermission) =>
        this.rolePermissionMapper.toDomain(rolePermission),
      ),
      pagination: {
        total,
        limit,
        position,
      },
    }
  }

  async removeResourceInChannel(
    resource: RolePermission,
    persistenceContext?: PersistenceContext,
  ): Promise<void> {
    const rolePermission = await this.getClient(
      persistenceContext?.tx,
    ).rolePermission.findFirst({
      where: {
        id: resource.id,
        channels: { some: { id: this.ctx.channel_id } },
      },
    })

    if (!rolePermission)
      throw new ConflictException('RolePermission not found!')

    await this.getClient(persistenceContext?.tx).rolePermission.delete({
      where: {
        id: resource.id,
        channels: { some: { id: this.ctx.channel_id } },
      },
      include: {
        role: true,
        permission: true,
      },
    })
  }

  async saveResourceToChannel(
    rolePermission: RolePermission,
    persistenceContext?: PersistenceContext,
  ): Promise<void> {
    const { role_id, permission_id, ...rest } =
      this.rolePermissionMapper.toPersistence(rolePermission)

    if (rolePermission.id) {
      await this.getClient(persistenceContext?.tx).rolePermission.update({
        where: {
          id: rolePermission.id,
          channels: { some: { id: this.ctx.channel_id } },
        },
        data: {
          ...rest,
          role: { connect: { id: role_id } },
          permission: { connect: { id: permission_id } },
          channels: { connect: { id: this.ctx.channel_id } },
        },
      })
    } else {
      const createdRolePermission = await this.getClient(
        persistenceContext?.tx,
      ).rolePermission.create({
        data: {
          ...rest,
          role: { connect: { id: role_id } },
          permission: { connect: { id: permission_id } },
          channels: { connect: { id: this.ctx.channel_id } },
        },
      })

      if (!createdRolePermission.id)
        throw new ConflictException(
          'An error occurred when creating the rolePermission!',
        )

      rolePermission.assignId(createdRolePermission.id)
    }
  }

  async removePermissionsByRoleId(
    role_id: string,
    permissionIds: string[],
    persistenceContext?: PersistenceContext,
  ) {
    await this.getClient(persistenceContext?.tx).rolePermission.deleteMany({
      where: {
        role_id,
        permission_id: { in: permissionIds },
        channels: { some: { id: this.ctx.channel_id } },
      },
    })

    return true
  }

  async addByRoleIdAndPermissionIds(
    role_id: string,
    permissionIds: string[],
    persistenceContext?: PersistenceContext,
  ) {
    const data = permissionIds.map((permission_id) => ({
      role_id,
      permission_id,
      channels: { connect: { id: this.ctx.channel_id } },
    }))

    return this.getClient(persistenceContext?.tx).rolePermission.createMany({
      data,
    })
  }

  async findRolePermission(
    role_id: string,
    permission_id: string,
    persistenceContext?: PersistenceContext,
  ): Promise<RolePermission | null> {
    const rp = await this.getClient(
      persistenceContext?.tx,
    ).rolePermission.findFirst({
      where: {
        role_id,
        permission_id,
        channels: { some: { id: this.ctx.channel_id } },
      },
    })

    return rp ? this.rolePermissionMapper.toDomain(rp) : null
  }
}
