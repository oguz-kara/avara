import { Injectable } from '@nestjs/common'
import { PaginationUtils } from '../../../../../../../libs/@shared/src/utils/pagination.util'
import { RequestContext } from '@avara/core/application/context/request-context'
import { DbService } from '@avara/shared/database/db-service'
import { PaginationParams } from '@avara/core/domain/user/api/types/pagination.type'
import { PaginatedItemsResponse } from '@avara/core/domain/user/api/types/items-response.type'
import { ID } from '@avara/shared/types/id.type'
import { FacetValue } from '@avara/core/domain/facet/infrastructure/types'
import {
  CreateFacetValueDto,
  EditFacetValueDto,
} from '../../api/graphql/dto/create-facet-value.dto'
import { PersistenceContext } from '@avara/core/database/channel-aware-repository.interface'

@Injectable()
export class FacetValueService {
  constructor(
    private readonly db: DbService,
    private readonly paginationUtils: PaginationUtils,
  ) {}

  async getFacetValueById(
    ctx: RequestContext,
    id: ID,
  ): Promise<FacetValue | null> {
    return await this.db.facetValue.findUnique({
      where: { id, channels: { some: { id: ctx.channel_id } } },
    })
  }

  async getFacetValuesWithPagination(
    ctx: RequestContext,
    params: PaginationParams,
    persistenceContext?: PersistenceContext,
  ): Promise<PaginatedItemsResponse<FacetValue>> {
    const { limit, position } =
      this.paginationUtils.validateAndGetPaginationLimit(params)

    const facetValues = await this.db.facetValue.findMany({
      where: { channels: { some: { id: ctx.channel_id } } },
      take: limit,
      skip: position,
      include: persistenceContext?.relations || undefined,
    })

    const total = await this.db.facetValue.count()

    return {
      items: facetValues,
      pagination: {
        limit,
        position,
        total,
      },
    }
  }

  async createFacetValue(
    ctx: RequestContext,
    createFacetValueInput: CreateFacetValueDto,
  ): Promise<FacetValue> {
    const { facet_id, ...facetValue } = createFacetValueInput

    return await this.db.facetValue.create({
      data: {
        ...facetValue,
        facet: {
          connect: { id: facet_id },
        },
        channels: {
          connect: { id: ctx.channel_id },
        },
      },
    })
  }

  async createFacetValueList(
    ctx: RequestContext,
    createFacetValueListInput: CreateFacetValueDto[],
  ): Promise<FacetValue[]> {
    return await Promise.all(
      createFacetValueListInput.map(async (facetValue) =>
        this.createFacetValue(ctx, facetValue),
      ),
    )
  }

  async editFacetValue(
    ctx: RequestContext,
    updateFacetValueInput: EditFacetValueDto,
  ): Promise<FacetValue> {
    const { id, facet_id, ...facetValue } = updateFacetValueInput

    return await this.db.facetValue.update({
      where: { id, channels: { some: { id: ctx.channel_id } } },
      data: {
        ...facetValue,
        ...(facet_id && {
          facet: {
            connect: { id: facet_id },
          },
        }),
      },
    })
  }

  async deleteFacetValue(ctx: RequestContext, id: ID): Promise<FacetValue> {
    return await this.db.facetValue.delete({
      where: { id, channels: { some: { id: ctx.channel_id } } },
    })
  }

  async softDeleteFacetValue(ctx: RequestContext, id: ID): Promise<FacetValue> {
    return await this.db.facetValue.update({
      where: { id, channels: { some: { id: ctx.channel_id } } },
      data: { deleted_at: new Date(), deleted_by: 'system' },
    })
  }
}
