import { Injectable } from '@nestjs/common'
import { Role } from '../../domain/entities/role.entity'
import { RolePersistence } from '../orm/persistence/role.persistence'
import { PermissionMapper } from './permission.mapper'
import { Mapper } from '@avara/shared/database/mapper.interface'
import { ChannelMapper } from '@avara/shared/modules/channel/infrastructure/mappers/channel.mapper'

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
      updated_by: entity.updated_by,
      created_by: entity.created_by,
      deleted_by: entity.deleted_by,
      deleted_at: entity.deleted_at,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
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
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      created_by: entity.created_by,
      updated_by: entity.updated_by,
      deleted_at: entity.deleted_at,
      deleted_by: entity.deleted_by,
    }
  }
}
