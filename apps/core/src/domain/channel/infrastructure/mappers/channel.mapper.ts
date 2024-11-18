import { Injectable } from '@nestjs/common'
import { Mapper } from '@avara/shared/database/mapper.interface'
import { ChannelPersistence } from '../orm/channel.persistence'
import { Channel } from '../../domain/entities/channel.entity'

@Injectable()
export class ChannelMapper implements Mapper<Channel, ChannelPersistence> {
  toDomain(entity: ChannelPersistence): Channel {
    return new Channel({
      id: entity.id,
      name: entity.name,
      code: entity.code,
      default_language_code: entity.default_language_code,
      currency_code: entity.currency_code,
      is_default: entity.is_default,
      updated_by: entity.updated_by,
      created_by: entity.created_by,
      deleted_by: entity.deleted_by,
      deleted_at: entity.deleted_at,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    })
  }

  toPersistence(entity: Channel): ChannelPersistence {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code,
      default_language_code: entity.default_language_code,
      currency_code: entity.currency_code,
      is_default: entity.is_default,
      updated_by: entity.updated_by,
      created_by: entity.created_by,
      deleted_by: entity.deleted_by,
      deleted_at: entity.deleted_at,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    }
  }

  toDomainList(entities: ChannelPersistence[]): Channel[] {
    return entities.map((entity) => this.toDomain(entity))
  }

  toPersistenceList(entities: Channel[]): ChannelPersistence[] {
    return entities.map((entity) => this.toPersistence(entity))
  }
}
