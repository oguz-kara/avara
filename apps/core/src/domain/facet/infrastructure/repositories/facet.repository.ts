import { Injectable } from '@nestjs/common'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/domain/user/api/types/pagination.type'
import {
  ContextSaver,
  PersistenceContext,
} from '@avara/core/database/channel-aware-repository.interface'
import { Facet, PrismaClient } from '@prisma/client'
import { DbTransactionalClient } from '@avara/shared/database/db-transactional-client'
import { DbService } from '@avara/shared/database/db-service'
import { FacetWithValues } from '../types'

@Injectable()
export class FacetRepository extends ContextSaver {
  transaction: DbTransactionalClient | null = null

  constructor(private readonly db: DbService) {
    super()
  }

  setTransactionObject(transaction: DbTransactionalClient): void {
    this.transaction = transaction
  }

  getClient(tx: DbTransactionalClient): DbTransactionalClient | PrismaClient {
    return tx ? tx : this.transaction ? this.transaction : this.db
  }

  async findById(
    id: string,
    persistenceContext?: PersistenceContext,
  ): Promise<Facet | FacetWithValues | null> {
    const facets = await this.getClient(
      persistenceContext?.tx,
    ).facet.findUnique({
      where: { id },
    })

    if (!facets) return null

    return facets
  }

  async findAll(
    args: PaginationParams,
    persistenceContext?: PersistenceContext,
  ): Promise<PaginatedList<Facet | FacetWithValues>> {
    const { limit, position } = args

    const total = await this.getClient(persistenceContext?.tx).facet.count()

    const facets = await this.getClient(persistenceContext?.tx).facet.findMany({
      take: limit,
      skip: position,
    })

    return {
      items: facets,
      pagination: {
        total,
        limit,
        position,
      },
    }
  }

  async edit(
    id: string,
    data: Facet,
    persistenceContext?: PersistenceContext,
  ): Promise<Facet> {
    return await this.getClient(persistenceContext?.tx).facet.update({
      where: {
        id,
      },
      data,
    })
  }

  async delete(
    id: string,
    data: Facet,
    persistenceContext?: PersistenceContext,
  ): Promise<Facet> {
    return await this.getClient(persistenceContext?.tx).facet.update({
      where: {
        id,
      },
      data,
    })
  }

  async softDelete(
    id: string,
    data: { deleted_by: string } = { deleted_by: 'system' },
    persistenceContext?: PersistenceContext,
  ): Promise<Facet> {
    return await this.getClient(persistenceContext?.tx).facet.update({
      where: {
        id,
      },
      data: { deleted_at: new Date(), deleted_by: data.deleted_by },
    })
  }

  async create(
    data: Facet,
    persistenceContext?: PersistenceContext,
  ): Promise<Facet> {
    return await this.getClient(persistenceContext?.tx).facet.create({
      data,
    })
  }
}
