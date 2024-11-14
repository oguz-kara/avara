import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Allow } from '@avara/shared/decorators/allow'
import {
  FindSeoMetadataListResponseType,
  SeoMetadata,
} from '../types/seo-metadata.graphql'
import { SeoMetadataService } from '../../../application/services/seo-metadata.service'
import { Permission } from '@avara/shared/enums/permission'
import {
  CreateSeoMetadataDto,
  UpdateSeoMetadataDto,
} from '../dto/seo-metadata.dto'
import { IDInput } from '@avara/core/domain/user/application/graphql/input/id.input'
import { PaginationParamsInput } from '@avara/shared/graphql/inputs/pagination-params.input'
import { Ctx } from '@avara/core/application/context/request-context.decorator'
import { RequestContext } from '@avara/core/application/context/request-context'

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
    return await this.seoMetadataService.createOne(ctx, createUserInput)
  }

  @Allow(
    Permission.CREATE_SEO_METADATA_GLOBAL,
    Permission.WRITE_SEO_METADATA_GLOBAL,
  )
  @Mutation(() => SeoMetadata)
  async updateSeoMetadata(
    @Ctx() ctx: RequestContext,
    @Args('id') id: string,
    @Args('input') updateSeoMetadataInput: UpdateSeoMetadataDto,
  ) {
    return await this.seoMetadataService.updateOne(
      ctx,
      id,
      updateSeoMetadataInput,
    )
  }

  @Allow(
    Permission.DELETE_SEO_METADATA_GLOBAL,
    Permission.WRITE_SEO_METADATA_GLOBAL,
  )
  @Mutation(() => SeoMetadata, { nullable: true })
  async removeSeoMetadataById(
    @Ctx() ctx: RequestContext,
    @Args('input') removeSeoMetadataInput: IDInput,
  ) {
    return await this.seoMetadataService.removeOne(
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
