import { Mapper } from '@avara/shared/database/mapper.interface'
import { Injectable } from '@nestjs/common'
import { Asset } from '../../domain/entities/asset.entity'
import { AssetPersistence } from '../orm/types/asset.persistence'
import { AssetType as DomainAssetType } from '../../domain/enums/asset-type.enum'
import { ChannelMapper } from '@avara/core/domain/channel/infrastructure/mappers/channel.mapper'
import { AssetType } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'

@Injectable()
export class AssetMapper implements Mapper<Asset, AssetPersistence> {
  constructor(private readonly channelMapper: ChannelMapper) {}

  async toDomain(assetPersistence: AssetPersistence): Promise<Asset> {
    return await Asset.create({
      id: assetPersistence.id,
      name: assetPersistence.name,
      original_name: assetPersistence.original_name,
      type: assetPersistence.type as DomainAssetType,
      source: assetPersistence.source,
      mime_type: assetPersistence.mime_type,
      file_size: assetPersistence.file_size,
      preview: assetPersistence.preview,
      width: assetPersistence.width,
      height: assetPersistence.height,
      focal_point: assetPersistence.focal_point as string,
      channels: this.channelMapper.toDomainList(assetPersistence.channels),
    })
  }

  toPersistence(asset: Asset): AssetPersistence {
    return {
      id: asset.id,
      name: asset.name,
      original_name: asset.original_name,
      type: asset.type as AssetType,
      mime_type: asset.mime_type,
      file_size: asset.file_size,
      source: asset.source,
      preview: asset.preview,
      width: asset.width,
      height: asset.height,
      focal_point: asset.focal_point as JsonValue,
      channels: this.channelMapper.toPersistenceList(asset.channels),
      created_at: asset.created_at,
      created_by: asset.created_by,
      updated_at: asset.updated_at,
      updated_by: asset.updated_by,
      deleted_at: asset.deleted_at,
      deleted_by: asset.deleted_by,
    }
  }
}
