import { Mapper } from '@avara/shared/database/mapper.interface'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ChannelMapper } from '@avara/core/domain/channel/infrastructure/mappers/channel.mapper'
import { SeoMetadataPersistence } from '../orm/seo-metadata.persisntence'
import { SeoMetadata } from '../../domain/entities/seo-metadata.entity'

Injectable()
export class SeoMetadataMapper
  implements Mapper<SeoMetadata, SeoMetadataPersistence>
{
  constructor(
    @Inject(forwardRef(() => ChannelMapper))
    private readonly channelMapper: ChannelMapper,
  ) {}

  async toDomain(persistence: SeoMetadataPersistence): Promise<SeoMetadata> {
    return await SeoMetadata.create({
      id: persistence.id,
      title: persistence.title,
      description: persistence.description,
      keywords: persistence.keywords,
      version: persistence.version,
      canonicalUrl: persistence.canonicalUrl,
      ogTitle: persistence.ogTitle,
      ogDescription: persistence.ogDescription,
      ogImage: persistence.ogImage,
      channels: persistence.channels.map((channel) =>
        this.channelMapper.toDomain(channel),
      ),
      robots: persistence.robots,
      schemaMarkup: persistence.schemaMarkup,
      hreflang: persistence.hreflang,
      pageType: persistence.pageType,
      createdAt: persistence.createdAt,
      updatedAt: persistence.updatedAt,
    })
  }

  toPersistence(
    domain: SeoMetadata,
  ): SeoMetadataPersistence | Promise<SeoMetadataPersistence> {
    return {
      id: domain.id,
      title: domain.title,
      description: domain.description,
      keywords: domain.keywords,
      version: domain.version,
      canonicalUrl: domain.canonicalUrl,
      ogTitle: domain.ogTitle,
      ogDescription: domain.ogDescription,
      ogImage: domain.ogImage,
      robots: domain.robots,
      schemaMarkup: domain.schemaMarkup,
      hreflang: domain.hreflang,
      pageType: domain.pageType,
      channels: domain.channels?.map((channel) =>
        this.channelMapper.toPersistence(channel),
      ),
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt,
    }
  }
}
