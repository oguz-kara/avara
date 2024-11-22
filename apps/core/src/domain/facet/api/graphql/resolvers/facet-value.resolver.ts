import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { PaginationParamsInput } from '@avara/shared/graphql/inputs/pagination-params.input'
import { Allow } from '@avara/shared/decorators/allow'
import { Permission } from '@avara/shared/enums/permission'
import { RequestContext } from '@avara/core/application/context/request-context'
import { Ctx } from '@avara/core/application/context/request-context.decorator'
import { IDInput } from '@avara/core/domain/user/application/graphql/input/id.input'
import { Relations } from '@avara/core/application/relations.decorator'
import {
  FacetValueType,
  FindFacetValuesResponseType,
} from '../types/facet-value.graphql'
import { FacetValueService } from '../../../application/services/facet-value.service'
import {
  CreateFacetValueDto,
  CreateFacetValueListDto,
  EditFacetValueDto,
} from '../dto/create-facet-value.dto'

@Resolver(() => FacetValueType)
export class FacetValueResolver {
  constructor(private readonly facetValueService: FacetValueService) {}

  @Allow(Permission.READ_FACET_VALUE_GLOBAL)
  @Query(() => FindFacetValuesResponseType)
  async facetValues(
    @Ctx() ctx: RequestContext,
    @Args('input', { nullable: true }) pagination?: PaginationParamsInput,
    @Relations({ depth: 5 }) relations?: Record<string, object | boolean>,
  ) {
    return await this.facetValueService.getFacetValuesWithPagination(
      ctx,
      pagination,
      {
        relations,
      },
    )
  }

  @Allow(Permission.READ_FACET_VALUE_GLOBAL)
  @Query(() => FacetValueType, { nullable: true })
  async facetValueById(
    @Ctx() ctx: RequestContext,
    @Args('input') findFacetValueInput: IDInput,
  ) {
    const { id } = findFacetValueInput
    return await this.facetValueService.getFacetValueById(ctx, id)
  }

  @Allow(
    Permission.CREATE_FACET_VALUE_GLOBAL,
    Permission.WRITE_FACET_VALUE_GLOBAL,
  )
  @Mutation(() => FacetValueType)
  async registerFacetValue(
    @Ctx() ctx: RequestContext,
    @Args('input') createFacetValueDto?: CreateFacetValueDto,
  ) {
    return await this.facetValueService.createFacetValue(
      ctx,
      createFacetValueDto,
    )
  }

  @Allow(
    Permission.CREATE_FACET_VALUE_GLOBAL,
    Permission.WRITE_FACET_VALUE_GLOBAL,
  )
  @Mutation(() => [FacetValueType])
  async registerFacetValueList(
    @Ctx() ctx: RequestContext,
    @Args('input') createFacetValueDto?: CreateFacetValueListDto,
  ) {
    const { values } = createFacetValueDto
    return await this.facetValueService.createFacetValueList(ctx, values)
  }

  @Allow(
    Permission.UPDATE_FACET_VALUE_GLOBAL,
    Permission.WRITE_FACET_VALUE_GLOBAL,
  )
  @Mutation(() => FacetValueType)
  async editFacetValue(
    @Ctx() ctx: RequestContext,
    @Args('input') editFacetValueDto?: EditFacetValueDto,
  ) {
    return await this.facetValueService.editFacetValue(ctx, editFacetValueDto)
  }

  @Allow(
    Permission.DELETE_FACET_VALUE_GLOBAL,
    Permission.WRITE_FACET_VALUE_GLOBAL,
  )
  @Mutation(() => FacetValueType)
  async terminateFacetValue(
    @Ctx() ctx: RequestContext,
    @Args('id') id?: string,
  ) {
    return await this.facetValueService.deleteFacetValue(ctx, id)
  }

  @Allow(
    Permission.DELETE_FACET_VALUE_GLOBAL,
    Permission.WRITE_FACET_VALUE_GLOBAL,
  )
  @Mutation(() => FacetValueType)
  async markFacetValueAsDeleted(
    @Ctx() ctx: RequestContext,
    @Args('id') id?: string,
  ) {
    return await this.facetValueService.softDeleteFacetValue(ctx, id)
  }
}
