import { Injectable } from '@nestjs/common'
import { PaginationUtils } from '../../../../../../../libs/@shared/src/utils/pagination.util'
import { RequestContext } from '@avara/core/application/context/request-context'
import { DbService } from '@avara/shared/database/db-service'
import { Facet } from '@avara/core/domain/facet/infrastructure/types'
import { PaginationParams } from '@avara/core/domain/user/api/types/pagination.type'
import { PaginatedItemsResponse } from '@avara/core/domain/user/api/types/items-response.type'
import {
  CreateFacetDto,
  EditFacetDto,
} from '../../api/graphql/dto/create-facet.dto'
import { ID } from '@avara/shared/types/id.type'
import { PersistenceContext } from '@avara/core/database/channel-aware-repository.interface'

@Injectable()
export class FacetService {
  constructor(
    private readonly db: DbService,
    private readonly paginationUtils: PaginationUtils,
  ) {}

  async getFacetById(
    ctx: RequestContext,
    id: ID,
    persistenceContext?: PersistenceContext,
  ): Promise<Facet | null> {
    const facet = await this.db.facet.findUnique({
      where: { id, channels: { some: { id: ctx.channelId } } },
      include: persistenceContext?.relations ?? undefined,
    })

    return facet
  }

  async getFacetsWithPagination(
    ctx: RequestContext,
    params: PaginationParams,
    persistenceContext?: PersistenceContext,
  ): Promise<PaginatedItemsResponse<Facet>> {
    const { limit, position } =
      this.paginationUtils.validateAndGetPaginationLimit(params)

    const facets = await this.db.facet.findMany({
      where: { channels: { some: { id: ctx.channelId } } },
      take: limit,
      skip: position,
      include: persistenceContext?.relations ?? undefined,
    })

    const total = await this.db.facet.count()

    return {
      items: facets,
      pagination: {
        limit,
        position,
        total,
      },
    }
  }

  async createNewFacet(
    ctx: RequestContext,
    facet: CreateFacetDto,
  ): Promise<Facet> {
    const createdFacet = await this.db.facet.create({
      data: { ...facet, channels: { connect: { id: ctx.channelId } } },
    })

    return createdFacet
  }

  async editFacet(
    ctx: RequestContext,
    id: ID,
    facet: EditFacetDto,
  ): Promise<Facet> {
    const updatedFacet = await this.db.facet.update({
      where: { id, channels: { some: { id: ctx.channelId } } },
      data: facet,
    })

    return updatedFacet
  }

  async deleteFacet(ctx: RequestContext, id: ID): Promise<Facet> {
    const deletedFacet = await this.db.facet.delete({
      where: { id, channels: { some: { id: ctx.channelId } } },
    })

    return deletedFacet
  }
}
