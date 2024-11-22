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
      originalName: assetPersistence.originalName,
      type: assetPersistence.type as DomainAssetType,
      source: assetPersistence.source,
      mimeType: assetPersistence.mimeType,
      fileSize: assetPersistence.fileSize,
      preview: assetPersistence.preview,
      width: assetPersistence.width,
      height: assetPersistence.height,
      focalPoint: assetPersistence.focalPoint as string,
      channels: this.channelMapper.toDomainList(assetPersistence.channels),
    })
  }

  toPersistence(asset: Asset): AssetPersistence {
    return {
      id: asset.id,
      name: asset.name,
      originalName: asset.originalName,
      type: asset.type as AssetType,
      mimeType: asset.mimeType,
      fileSize: asset.fileSize,
      storageProvider: asset.storageProvider,
      source: asset.source,
      preview: asset.preview,
      width: asset.width,
      height: asset.height,
      focalPoint: asset.focalPoint as JsonValue,
      channels: this.channelMapper.toPersistenceList(asset.channels),
      createdAt: asset.createdAt,
      createdBy: asset.createdBy,
      updatedAt: asset.updatedAt,
      updatedBy: asset.updatedBy,
      deletedAt: asset.deletedAt,
      deletedBy: asset.deletedBy,
    }
  }
}
