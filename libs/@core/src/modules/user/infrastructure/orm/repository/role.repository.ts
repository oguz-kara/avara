import { ConflictException, Injectable } from '@nestjs/common'

import { Role } from '@avara/core/modules/user/domain/entities/role.entity'
import { DbService } from '@avara/shared/database/db-service'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/modules/user/api/types/pagination.type'

import { RoleMapper } from '../../mappers/role.mapper'
import { NameFinder } from '../../interfaces/name-finder'
import {
  ChannelResourceFinder,
  ChannelResourceRemover,
  ContextSaver,
} from '@avara/shared/database/channel-aware-repository.interface'

@Injectable()
export class RoleRepository
  extends ContextSaver
  implements
    ChannelResourceRemover<Role>,
    ChannelResourceFinder<Role>,
    NameFinder<Role>,
    ChannelResourceFinder<Role>
{
  constructor(
    private readonly roleMapper: RoleMapper,
    private readonly db: DbService,
  ) {
    super()
  }

  async findOneInChannel(id: string): Promise<Role | null> {
    const role = await this.db.role.findUnique({
      where: { id, channels: { some: { id: this.ctx.channel_id } } },
      include: {
        channels: true,
      },
    })

    if (!role) return null

    return this.roleMapper.toDomain(role)
  }

  async findOneByNameInChannel(name: string): Promise<Role | null> {
    const role = await this.db.role.findFirst({
      where: { name },
      include: { channels: true },
    })

    if (!role) return null

    return this.roleMapper.toDomain(role)
  }

  async findManyInChannel(
    args: PaginationParams,
  ): Promise<PaginatedList<Role>> {
    const { limit, position } = args

    const total = await this.db.role.count()

    const users = await this.db.role.findMany({
      where: {
        channels: {
          some: {
            id: this.ctx.channel_id,
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

  async removeResourceInChannel(role: Role): Promise<void> {
    const roleChannels = role.channels

    if (roleChannels.length === 1)
      await this.db.role.delete({ where: { id: role.id } })
    else {
      role.removeChannel(this.ctx.channel)
      await this.save(role)
    }
  }

  async save(role: Role): Promise<void> {
    const { permissions, channels, ...persistenceRole } =
      this.roleMapper.toPersistence(role)

    if (!role.id) {
      const { channels, ...persistenceRole } =
        this.roleMapper.toPersistence(role)

      const createdRole = await this.db.role.create({
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

    await this.db.role.update({
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
            role_permissions: {
              deleteMany: {},
              createMany: {
                data: permissions.map((permission) => ({
                  permission_id: permission.id,
                })),
              },
            },
          }),
      },
    })
  }
}
