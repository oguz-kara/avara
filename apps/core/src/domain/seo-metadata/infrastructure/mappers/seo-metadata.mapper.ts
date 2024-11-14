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
      canonical_url: persistence.canonical_url,
      og_title: persistence.og_title,
      og_description: persistence.og_description,
      og_image: persistence.og_image,
      channels: persistence.channels.map((channel) =>
        this.channelMapper.toDomain(channel),
      ),
      robots: persistence.robots,
      schema_markup: persistence.schema_markup,
      hreflang: persistence.hreflang,
      page_type: persistence.page_type,
      created_at: persistence.created_at,
      updated_at: persistence.updated_at,
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
      canonical_url: domain.canonical_url,
      og_title: domain.og_title,
      og_description: domain.og_description,
      og_image: domain.og_image,
      robots: domain.robots,
      schema_markup: domain.schema_markup,
      hreflang: domain.hreflang,
      page_type: domain.page_type,
      channels: domain.channels?.map((channel) =>
        this.channelMapper.toPersistence(channel),
      ),
      created_at: domain.created_at,
      updated_at: domain.updated_at,
    }
  }
}
