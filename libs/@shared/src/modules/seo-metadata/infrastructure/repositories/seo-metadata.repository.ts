import { Injectable, NotFoundException } from '@nestjs/common'
import {
  ChannelResourceFinder,
  ChannelResourceRemover,
  ChannelResourceSaver,
  ContextSaver,
} from '@avara/shared/database/channel-aware-repository.interface'
import { DbService } from '@avara/shared/database/db-service'
import { SeoMetadataMapper } from '../mappers/seo-metadata.mapper'
import { SeoMetadata } from '../../domain/entities/seo-metadata.entity'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/modules/user/api/types/pagination.type'

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

    return this.seoMetadataMapper.toDomain(seoMetadata)
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
      items: seoMetadatas.map((seoMetadata) =>
        this.seoMetadataMapper.toDomain(seoMetadata),
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
    const role = await this.db.seoMetadata.findFirst({
      where: { id: seoMetadata.id },
    })

    if (!role) throw new NotFoundException('SeoMetadata not found to delete!')

    await this.db.seoMetadata.delete({
      where: {
        id: seoMetadata.id,
        channels: { some: { id: this.ctx.channel_id } },
      },
    })
  }

  async saveResourceToChannel(seoMetadata: SeoMetadata): Promise<void> {
    const { channels, ...rest } =
      this.seoMetadataMapper.toPersistence(seoMetadata)
    if (seoMetadata.id) {
      await this.db.seoMetadata.update({
        where: {
          id: seoMetadata.id,
          channels: { some: { id: this.ctx.channel_id } },
        },
        data: {
          ...rest,
          channels: {
            set: channels
              ? channels.map((channel) => ({ id: channel.id }))
              : { id: this.ctx.channel_id },
          },
        },
      })
    } else {
      const newSeoMetadata = await this.db.seoMetadata.create({
        data: {
          channels: {
            connect: channels
              ? channels.map((channel) => ({ id: channel.id }))
              : { id: this.ctx.channel_id },
          },
          ...rest,
        },
      })

      seoMetadata.assignId(newSeoMetadata.id)
    }
  }
}
