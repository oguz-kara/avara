import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Allow } from '@avara/shared/decorators/allow'
import { RequestContext } from '@avara/core/context/request-context'
import { Ctx } from '@avara/core/context/request-context.decorator'
import {
  FindSeoMetadataListResponseType,
  SeoMetadata,
} from '../types/seo-metadata.graphql'
import { SeoMetadataService } from '../../../application/services/seo-metadata.service'
import { Permission } from '@avara/shared/enums/permission'
import { CreateSeoMetadataDto } from '../dto/seo-metadata.dto'
import { IDInput } from '@avara/core/modules/user/application/graphql/input/id.input'
import { PaginationParamsInput } from '@avara/shared/graphql/inputs/pagination-params.input'

@Resolver(() => SeoMetadata)
export class SeoMetadataResolver {
  constructor(private readonly seoMetadataService: SeoMetadataService) {}

  @Allow(
    Permission.CREATE_SEO_METADATA_GLOBAL,
    Permission.WRITE_SEO_METADATA_GLOBAL,
  )
  @Mutation(() => SeoMetadata)
  async createSeoMetadata(
    @Ctx() ctx: RequestContext,
    @Args('input') createUserInput: CreateSeoMetadataDto,
  ) {
    return await this.seoMetadataService.createSeoMetadata(ctx, createUserInput)
  }

  @Allow(
    Permission.DELETE_SEO_METADATA_GLOBAL,
    Permission.WRITE_SEO_METADATA_GLOBAL,
  )
  @Mutation(() => SeoMetadata)
  async removeSeoMetadataById(
    @Ctx() ctx: RequestContext,
    @Args('input') removeSeoMetadataInput: IDInput,
  ) {
    return await this.seoMetadataService.removeSeoMetadataById(
      ctx,
      removeSeoMetadataInput.id,
    )
  }

  @Allow(Permission.READ_SEO_METADATA_GLOBAL)
  @Query(() => FindSeoMetadataListResponseType)
  async seoMetadataList(
    @Ctx() ctx: RequestContext,
    @Args('input', { nullable: true }) pagination?: PaginationParamsInput,
  ) {
    return await this.seoMetadataService.findMany(ctx, pagination)
  }

  @Allow(Permission.READ_SEO_METADATA_GLOBAL)
  @Query(() => SeoMetadata, { nullable: true })
  async findSeoMetadataById(
    @Ctx() ctx: RequestContext,
    @Args('input') findSeoMetadataInput: IDInput,
  ) {
    const resolverSeoMetadata = await this.seoMetadataService.findOne(
      ctx,
      findSeoMetadataInput.id,
    )

    return resolverSeoMetadata
  }
}
