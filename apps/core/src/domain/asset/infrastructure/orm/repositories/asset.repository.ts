import { Injectable } from '@nestjs/common'
import {
  ChannelResourceFinder,
  ChannelResourceRemover,
  ChannelResourceSaver,
  ContextSaver,
  PersistenceContext,
} from '@avara/core/database/channel-aware-repository.interface'
import { DbService } from '@avara/shared/database/db-service'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/domain/user/api/types/pagination.type'
import { Channel } from '@avara/core/domain/channel/domain/entities/channel.entity'
import { Asset } from '../../../domain/entities/asset.entity'
import { AssetMapper } from '../../mappers/asset.mapper'
import { TransactionAware } from '@avara/shared/database/transaction-aware.abstract'
import { DbTransactionalClient } from '@avara/shared/database/db-transactional-client'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class AssetRepository
  extends ContextSaver
  implements
    ChannelResourceSaver<Asset>,
    ChannelResourceRemover<Asset>,
    ChannelResourceFinder<Asset>,
    TransactionAware
{
  transaction: DbTransactionalClient | null = null

  constructor(
    private readonly db: DbService,
    private readonly assetMapper: AssetMapper,
  ) {
    super()
  }

  setTransactionObject(transaction: DbTransactionalClient) {
    this.transaction = transaction
  }

  getClient(tx: DbTransactionalClient): DbTransactionalClient | PrismaClient {
    return tx ? tx : this.transaction || this.db
  }

  async findOneInChannel(
    id: string,
    persistenceContext?: PersistenceContext,
  ): Promise<Asset | null> {
    const asset = await this.getClient(persistenceContext?.tx).asset.findUnique(
      {
        where: { id, channels: { some: { id: this.ctx.channel_id } } },
        include: {
          channels: true,
        },
      },
    )

    if (!asset) return null

    return await this.assetMapper.toDomain(asset)
  }

  async findManyInChannel(
    args: PaginationParams,
    persistenceContext?: PersistenceContext,
  ): Promise<PaginatedList<Asset>> {
    const { limit, position } = args

    const total = await this.getClient(persistenceContext?.tx).asset.count()

    const assets = await this.getClient(persistenceContext?.tx).asset.findMany({
      where: {
        channels: {
          some: { id: this.ctx.channel_id },
        },
      },
      take: limit,
      skip: position,
      include: {
        channels: true,
      },
    })

    return {
      items: await Promise.all(
        assets.map(async (asset) => await this.assetMapper.toDomain(asset)),
      ),
      pagination: {
        total,
        limit,
        position,
      },
    }
  }

  async removeResourceInChannel(
    asset: Asset,
    persistenceContext?: PersistenceContext,
  ): Promise<void | null> {
    await this.getClient(persistenceContext?.tx).asset.delete({
      where: {
        id: asset.id,
        channels: { some: { id: this.ctx.channel_id } },
      },
    })
  }

  async saveResourceToChannel(
    asset: Asset,
    persistenceContext?: PersistenceContext,
  ): Promise<void> {
    const persistenceData = this.assetMapper.toPersistence(asset)

    if (asset.id)
      await this.updateAsset(asset.id, persistenceData, persistenceContext)
    else {
      const newEntry = await this.createAsset(
        persistenceData,
        persistenceContext,
      )

      asset.assignId(newEntry.id)
      await asset.edit({
        channels: newEntry.channels,
        created_at: newEntry.created_at,
        updated_at: newEntry.updated_at,
      })
    }
  }

  private async updateAsset(
    id: string,
    data: any,
    persistenceContext?: PersistenceContext,
  ): Promise<void> {
    const { channels, ...rest } = data
    await this.getClient(persistenceContext?.tx).asset.update({
      where: {
        id,
        channels: { some: { id: this.ctx.channel_id } },
      },
      data: {
        ...rest,
        channels: this.mapChannelsForPersistence(channels),
      },
    })
  }

  private async createAsset(
    data: any,
    persistenceContext?: PersistenceContext,
  ): Promise<Asset> {
    const { channels, ...rest } = data
    const newAsset = await this.getClient(persistenceContext?.tx).asset.create({
      data: {
        ...rest,
        channels: this.mapChannelsForPersistence(channels),
      },
      include: {
        channels: true,
      },
    })

    return await this.assetMapper.toDomain(newAsset)
  }

  private mapChannelsForPersistence(channels?: Channel[]): any {
    return {
      connect: channels
        ? channels.map((channel) => ({ id: channel.id }))
        : { id: this.ctx.channel_id },
    }
  }
}
