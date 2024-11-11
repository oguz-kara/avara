import { ConflictException, Injectable } from '@nestjs/common'

import { RolePermissionMapper } from '../../mappers/role-permission.mapper'
import { RolePermission } from '@avara/core/modules/user/domain/entities/role-permission.entity'
import { DbService } from '../../../../../../../@shared/src/database/db-service'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/modules/user/api/types/pagination.type'
import {
  ChannelResourceFinder,
  ChannelResourceRemover,
  ChannelResourceSaver,
  ContextSaver,
} from '@avara/shared/database/channel-aware-repository.interface'

@Injectable()
export class RolePermissionRepository
  extends ContextSaver
  implements
    ChannelResourceFinder<RolePermission>,
    ChannelResourceRemover<RolePermission>,
    ChannelResourceSaver<RolePermission>
{
  constructor(
    private readonly rolePermissionMapper: RolePermissionMapper,
    private readonly db: DbService,
  ) {
    super()
  }

  async findOneInChannel(id: string): Promise<RolePermission | null> {
    const rolePermission = await this.db.rolePermission.findUnique({
      where: { id, channels: { some: { id: this.ctx.channel_id } } },
      include: { role: true, permission: true },
    })

    if (!rolePermission) return null

    return this.rolePermissionMapper.toDomain(rolePermission)
  }

  async findByRoleId(role_id: string): Promise<RolePermission[]> {
    const rolePermissions = await this.db.rolePermission.findMany({
      where: { role_id, channels: { some: { id: this.ctx.channel_id } } },
      include: { permission: true, role: true },
    })

    return rolePermissions.map((rolePermission) =>
      this.rolePermissionMapper.toDomain(rolePermission),
    )
  }

  async findManyInChannel(
    args: PaginationParams,
  ): Promise<PaginatedList<RolePermission>> {
    const { limit, position } = args

    const total = await this.db.rolePermission.count()

    const rolePermissions = await this.db.rolePermission.findMany({
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

  async removeResourceInChannel(resource: RolePermission): Promise<void> {
    const rolePermission = await this.db.rolePermission.findFirst({
      where: {
        id: resource.id,
        channels: { some: { id: this.ctx.channel_id } },
      },
    })

    if (!rolePermission)
      throw new ConflictException('RolePermission not found!')

    await this.db.rolePermission.delete({
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

  async saveResourceToChannel(rolePermission: RolePermission): Promise<void> {
    const { role_id, permission_id, ...rest } =
      this.rolePermissionMapper.toPersistence(rolePermission)

    if (rolePermission.id) {
      await this.db.rolePermission.update({
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
      const createdRolePermission = await this.db.rolePermission.create({
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

  async removePermissionsByRoleId(role_id: string, permissionIds: string[]) {
    await this.db.rolePermission.deleteMany({
      where: {
        role_id,
        permission_id: { in: permissionIds },
        channels: { some: { id: this.ctx.channel_id } },
      },
    })

    return true
  }

  async addByRoleIdAndPermissionIds(role_id: string, permissionIds: string[]) {
    const data = permissionIds.map((permission_id) => ({
      role_id,
      permission_id,
      channels: { connect: { id: this.ctx.channel_id } },
    }))

    return this.db.rolePermission.createMany({
      data,
    })
  }

  async findRolePermission(
    role_id: string,
    permission_id: string,
  ): Promise<RolePermission | null> {
    const rp = await this.db.rolePermission.findFirst({
      where: {
        role_id,
        permission_id,
        channels: { some: { id: this.ctx.channel_id } },
      },
    })

    return rp ? this.rolePermissionMapper.toDomain(rp) : null
  }
}
