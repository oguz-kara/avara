import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { FacetService } from '@avara/core/domain/facet/application/services/facet.service'
import { PaginationParamsInput } from '@avara/shared/graphql/inputs/pagination-params.input'
import { Allow } from '@avara/shared/decorators/allow'
import { Permission } from '@avara/shared/enums/permission'
import { RequestContext } from '@avara/core/application/context/request-context'
import { Ctx } from '@avara/core/application/context/request-context.decorator'
import { FacetType, FindFacetsResponseType } from '../types/facet.graphql'
import { CreateFacetDto, EditFacetDto } from '../dto/create-facet.dto'
import { IDInput } from '@avara/core/domain/user/application/graphql/input/id.input'
import { Relations } from '@avara/core/application/relations.decorator'

@Resolver(() => FacetType)
export class FacetResolver {
  constructor(private readonly facetService: FacetService) {}

  @Allow(Permission.READ_FACET_GLOBAL)
  @Query(() => FindFacetsResponseType)
  async facets(
    @Ctx() ctx: RequestContext,
    @Args('input', { nullable: true }) pagination?: PaginationParamsInput,
    @Relations({ depth: 5 }) relations?: Record<string, object | boolean>,
  ) {
    return await this.facetService.getFacetsWithPagination(ctx, pagination, {
      relations,
    })
  }

  @Allow(Permission.READ_FACET_GLOBAL)
  @Query(() => FacetType, { nullable: true })
  async facetById(
    @Ctx() ctx: RequestContext,
    @Args('paging') findFacetInput: IDInput,
    @Relations({ depth: 5 }) relations?: Record<string, object | boolean>,
  ) {
    const { id } = findFacetInput
    return await this.facetService.getFacetById(ctx, id, { relations })
  }

  @Allow(Permission.CREATE_FACET_GLOBAL, Permission.WRITE_FACET_GLOBAL)
  @Mutation(() => FacetType)
  async registerFacet(
    @Ctx() ctx: RequestContext,
    @Args('input') createFacetDto?: CreateFacetDto,
  ) {
    return await this.facetService.createNewFacet(ctx, createFacetDto)
  }

  @Allow(Permission.UPDATE_FACET_GLOBAL, Permission.WRITE_FACET_GLOBAL)
  @Mutation(() => FacetType)
  async editFacet(
    @Ctx() ctx: RequestContext,
    @Args('id') id?: string,
    @Args('input') editFacetDto?: EditFacetDto,
  ) {
    return await this.facetService.editFacet(ctx, id, editFacetDto)
  }

  @Allow(Permission.DELETE_FACET_GLOBAL, Permission.WRITE_FACET_GLOBAL)
  @Mutation(() => FacetType)
  async terminateFacet(@Ctx() ctx: RequestContext, @Args('id') id?: string) {
    return await this.facetService.deleteFacet(ctx, id)
  }
}
