import { Injectable } from '@nestjs/common'
import { Mapper } from '@avara/shared/database/mapper.interface'
import { ChannelMapper } from '@avara/core/domain/channel/infrastructure/mappers/channel.mapper'
import { RolePersistence } from '../orm/persistence/role.persistence'
import { Role } from '../../domain/entities/role.entity'
import { PermissionMapper } from './permission.mapper'

@Injectable()
export class RoleMapper implements Mapper<Role, RolePersistence> {
  constructor(
    private readonly permissionMapper: PermissionMapper,
    private readonly channelMapper: ChannelMapper,
  ) {}

  toDomain(entity: RolePersistence): Role {
    const permissions =
      entity.permissions?.map((permission) =>
        this.permissionMapper.toDomain(permission),
      ) || undefined
    const channels =
      entity.channels?.map((channel) => this.channelMapper.toDomain(channel)) ||
      undefined

    return new Role({
      id: entity.id,
      name: entity.name,
      permissions: permissions,
      channels: channels,
      updatedBy: entity.updatedBy,
      createdBy: entity.createdBy,
      deletedBy: entity.deletedBy,
      deletedAt: entity.deletedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
  }

  toPersistence(entity: Role): RolePersistence {
    const permissions =
      entity.permissions?.map((permission) =>
        this.permissionMapper.toPersistence(permission),
      ) || undefined
    const channels =
      entity.channels?.map((channel) =>
        this.channelMapper.toPersistence(channel),
      ) || undefined

    return {
      id: entity.id,
      name: entity.name,
      permissions: permissions,
      channels: channels,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
      deletedAt: entity.deletedAt,
      deletedBy: entity.deletedBy,
    }
  }
}
