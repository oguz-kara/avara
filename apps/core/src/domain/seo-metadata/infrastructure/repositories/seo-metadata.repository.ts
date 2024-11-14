import { Injectable } from '@nestjs/common'
import {
  ChannelResourceFinder,
  ChannelResourceRemover,
  ChannelResourceSaver,
  ContextSaver,
} from '@avara/core/database/channel-aware-repository.interface'
import { DbService } from '@avara/shared/database/db-service'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/domain/user/api/types/pagination.type'
import { Channel } from '@avara/core/domain/channel/domain/entities/channel.entity'
import { SeoMetadata } from '../../domain/entities/seo-metadata.entity'
import { SeoMetadataMapper } from '../mappers/seo-metadata.mapper'

@Injectable()
export class SeoMetadataRepository
  extends ContextSaver
  implements
    ChannelResourceSaver<SeoMetadata>,
    ChannelResourceRemover<SeoMetadata>,
    ChannelResourceFinder<SeoMetadata>
{
  constructor(
    private readonly db: DbService,
    private readonly seoMetadataMapper: SeoMetadataMapper,
  ) {
    super()
  }

  async findOneInChannel(id: string): Promise<SeoMetadata | null> {
    const seoMetadata = await this.db.seoMetadata.findUnique({
      where: { id, channels: { some: { id: this.ctx.channel_id } } },
      include: {
        channels: true,
      },
    })

    if (!seoMetadata) return null

    return await this.seoMetadataMapper.toDomain(seoMetadata)
  }

  async findManyInChannel(
    args: PaginationParams,
  ): Promise<PaginatedList<SeoMetadata>> {
    const { limit, position } = args

    const total = await this.db.seoMetadata.count()

    const seoMetadatas = await this.db.seoMetadata.findMany({
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
        seoMetadatas.map(
          async (seoMetadata) =>
            await this.seoMetadataMapper.toDomain(seoMetadata),
        ),
      ),
      pagination: {
        total,
        limit,
        position,
      },
    }
  }

  async removeResourceInChannel(
    seoMetadata: SeoMetadata,
  ): Promise<void | null> {
    await this.db.seoMetadata.delete({
      where: {
        id: seoMetadata.id,
        channels: { some: { id: this.ctx.channel_id } },
      },
    })
  }

  async saveResourceToChannel(seoMetadata: SeoMetadata): Promise<void> {
    const persistenceData = this.seoMetadataMapper.toPersistence(seoMetadata)

    if (seoMetadata.id)
      await this.updateSeoMetadata(seoMetadata.id, persistenceData)
    else {
      const newEntry = await this.createSeoMetadata(persistenceData)

      seoMetadata.assignId(newEntry.id)
      await seoMetadata.edit({
        channels: newEntry.channels,
        created_at: newEntry.created_at,
        updated_at: newEntry.updated_at,
      })
    }
  }

  private async updateSeoMetadata(id: string, data: any): Promise<void> {
    const { channels, ...rest } = data
    await this.db.seoMetadata.update({
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

  private async createSeoMetadata(data: any): Promise<SeoMetadata> {
    const { channels, ...rest } = data
    const newSeoMetadata = await this.db.seoMetadata.create({
      data: {
        ...rest,
        channels: this.mapChannelsForPersistence(channels),
      },
      include: {
        channels: true,
      },
    })

    return await this.seoMetadataMapper.toDomain(newSeoMetadata)
  }

  private mapChannelsForPersistence(channels?: Channel[]): any {
    return {
      connect: channels
        ? channels.map((channel) => ({ id: channel.id }))
        : { id: this.ctx.channel_id },
    }
  }
}
