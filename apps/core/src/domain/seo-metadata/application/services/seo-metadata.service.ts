import { Injectable, NotFoundException } from '@nestjs/common'
import { PaginationUtils } from '@avara/shared/utils/pagination.util'
import { RequestContext } from '@avara/core/application/context/request-context'
import { CreateSeoMetadataDto } from '../../api/graphql/dto/seo-metadata.dto'
import { PaginationParams } from '@avara/core/domain/user/api/types/pagination.type'
import { PaginatedItemsResponse } from '@avara/core/domain/user/api/types/items-response.type'
import { CoreRepositories } from '@avara/core/application/core-repositories'
import { SeoMetadata } from '../../domain/entities/seo-metadata.entity'

@Injectable()
export class SeoMetadataService {
  constructor(
    private readonly repositories: CoreRepositories,
    private readonly paginationUtils: PaginationUtils,
  ) {}

  async createOne(ctx: RequestContext, input: CreateSeoMetadataDto) {
    const seoMetadataRepo = this.repositories.get(ctx, 'SeoMetadata')

    const seoMetadata = await SeoMetadata.create({
      title: input.title,
      description: input.description,
      keywords: input.keywords,
      version: input.version,
      canonicalUrl: input.canonicalUrl,
      ogDescription: input.ogDescription,
      hreflang: input.hreflang,
      ogImage: input.ogImage,
      ogTitle: input.ogTitle,
      pageType: input.pageType,
      robots: input.robots,
      schemaMarkup: input.schemaMarkup,
    })

    await seoMetadataRepo.saveResourceToChannel(seoMetadata)

    return seoMetadata
  }

  async findOne(ctx: RequestContext, id: string): Promise<SeoMetadata | null> {
    const seoMetadataRepo = this.repositories.get(ctx, 'SeoMetadata')

    const seoMetadata = await seoMetadataRepo.findOneInChannel(id)

    return seoMetadata
  }

  async findMany(
    ctx: RequestContext,
    params?: PaginationParams,
  ): Promise<PaginatedItemsResponse<SeoMetadata>> {
    const seoMetadataRepo = this.repositories.get(ctx, 'SeoMetadata')

    const { limit, position } =
      this.paginationUtils.validateAndGetPaginationLimit(params)

    const seoMetadataData = await seoMetadataRepo.findManyInChannel({
      limit,
      position,
    })

    return seoMetadataData
  }

  async updateOne(
    ctx: RequestContext,
    id: string,
    dto: Partial<CreateSeoMetadataDto>,
  ) {
    const seoMetadataRepo = this.repositories.get(ctx, 'SeoMetadata')

    const seoMetadata = await seoMetadataRepo.findOneInChannel(id)

    if (!seoMetadata)
      throw new NotFoundException('SeoMetadata not found to update!')

    await seoMetadata.edit(dto)

    await seoMetadataRepo.saveResourceToChannel(seoMetadata)

    return seoMetadata
  }

  async removeOne(ctx: RequestContext, id: string) {
    const seoMetadataRepo = this.repositories.get(ctx, 'SeoMetadata')

    const seoMetadata = await seoMetadataRepo.findOneInChannel(id)

    if (!seoMetadata)
      throw new NotFoundException('SeoMetadata not found to delete!')

    await seoMetadataRepo.removeResourceInChannel(seoMetadata)

    return seoMetadata
  }
}
