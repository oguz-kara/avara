import { ConflictException, Injectable } from '@nestjs/common'

import { Role } from '@avara/core/domain/user/domain/entities/role.entity'
import { DbService } from '@avara/shared/database/db-service'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/domain/user/api/types/pagination.type'

import { RoleMapper } from '../../mappers/role.mapper'
import { NameFinder } from '../../interfaces/name-finder'
import {
  ChannelResourceFinder,
  ChannelResourceRemover,
  ContextSaver,
  PersistenceContext,
} from '@avara/core/database/channel-aware-repository.interface'
import { TransactionAware } from '@avara/shared/database/transaction-aware.abstract'
import { DbTransactionalClient } from '@avara/shared/database/db-transactional-client'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class RoleRepository
  extends ContextSaver
  implements
    ChannelResourceRemover<Role>,
    ChannelResourceFinder<Role>,
    NameFinder<Role>,
    ChannelResourceFinder<Role>,
    TransactionAware
{
  transaction: DbTransactionalClient | null = null

  constructor(
    private readonly roleMapper: RoleMapper,
    private readonly db: DbService,
  ) {
    super()
  }

  getClient(
    transaction?: DbTransactionalClient,
  ): DbTransactionalClient | PrismaClient {
    return transaction
      ? transaction
      : this.transaction
        ? this.transaction
        : this.db
  }

  setTransactionObject(transaction: DbTransactionalClient): void {
    this.transaction = transaction
  }

  async findOneInChannel(
    id: string,
    persistenceContext?: PersistenceContext,
  ): Promise<Role | null> {
    const role = await this.getClient(persistenceContext.tx).role.findUnique({
      where: { id, channels: { some: { id: this.ctx.channelId } } },
      include: {
        channels: true,
      },
    })

    if (!role) return null

    return this.roleMapper.toDomain(role)
  }

  async findOneByNameInChannel(
    name: string,
    persistenceContext?: PersistenceContext,
  ): Promise<Role | null> {
    const role = await this.getClient(persistenceContext.tx).role.findFirst({
      where: { name },
      include: { channels: true },
    })

    if (!role) return null

    return this.roleMapper.toDomain(role)
  }

  async findManyInChannel(
    args: PaginationParams,
    persistenceContext?: PersistenceContext,
  ): Promise<PaginatedList<Role>> {
    const { limit, position } = args

    const total = await this.getClient(persistenceContext.tx).role.count()

    const users = await this.getClient(persistenceContext.tx).role.findMany({
      where: {
        channels: {
          some: {
            id: this.ctx.channelId,
          },
        },
      },
      take: limit,
      skip: position,
      select: {
        id: true,
        name: true,
      },
    })

    return {
      items: users.map((role) => this.roleMapper.toDomain(role)),
      pagination: {
        total,
        limit,
        position,
      },
    }
  }

  async removeResourceInChannel(
    role: Role,
    persistenceContext?: PersistenceContext,
  ): Promise<void> {
    const roleChannels = role.channels

    if (roleChannels.length === 1)
      await this.getClient(persistenceContext.tx).role.delete({
        where: { id: role.id },
      })
    else {
      role.removeChannel(this.ctx.channel)
      await this.save(role)
    }
  }

  async save(
    role: Role,
    persistenceContext?: PersistenceContext,
  ): Promise<void> {
    const { permissions, channels, ...persistenceRole } =
      this.roleMapper.toPersistence(role)

    if (!role.id) {
      const { channels, ...persistenceRole } =
        this.roleMapper.toPersistence(role)

      const createdRole = await this.getClient(
        persistenceContext.tx,
      ).role.create({
        data: {
          name: persistenceRole.name,
          channels: {
            ...(channels && {
              connect: channels.map((channel) => ({
                id: channel.id,
              })),
            }),
          },
        },
      })

      if (!createdRole.id)
        throw new ConflictException('An error occurred when creating the role!')

      role.assignId(createdRole.id)

      return
    }

    await this.getClient(persistenceContext.tx).role.update({
      where: { id: role.id },
      data: {
        ...(channels &&
          channels.length > 0 && {
            channels: {
              set: channels.map((channel) => ({ id: channel.id })),
            },
          }),
        ...persistenceRole,
        ...(permissions &&
          permissions.length > 0 && {
            rolePermissions: {
              deleteMany: {},
              createMany: {
                data: permissions.map((permission) => ({
                  permissionId: permission.id,
                })),
              },
            },
          }),
      },
    })
  }
}
