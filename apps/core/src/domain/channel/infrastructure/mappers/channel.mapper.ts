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
      defaultLanguageCode: entity.defaultLanguageCode,
      currencyCode: entity.currencyCode,
      isDefault: entity.isDefault,
      updatedBy: entity.updatedBy,
      createdBy: entity.createdBy,
      deletedBy: entity.deletedBy,
      deletedAt: entity.deletedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
  }

  toPersistence(entity: Channel): ChannelPersistence {
    return {
      id: entity.id,
      name: entity.name,
      code: entity.code,
      defaultLanguageCode: entity.defaultLanguageCode,
      currencyCode: entity.currencyCode,
      isDefault: entity.isDefault,
      updatedBy: entity.updatedBy,
      createdBy: entity.createdBy,
      deletedBy: entity.deletedBy,
      deletedAt: entity.deletedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }

  toDomainList(entities: ChannelPersistence[]): Channel[] {
    return entities.map((entity) => this.toDomain(entity))
  }

  toPersistenceList(entities: Channel[]): ChannelPersistence[] {
    return entities.map((entity) => this.toPersistence(entity))
  }
}
