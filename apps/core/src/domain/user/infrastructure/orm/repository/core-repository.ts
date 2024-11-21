import {
  ContextSaver,
  PersistenceContext,
} from '@avara/core/database/channel-aware-repository.interface'
import { DbService } from '@avara/shared/database/db-service'
import { DbTransactionalClient } from '@avara/shared/database/db-transactional-client'
import { Prisma, PrismaClient } from '@prisma/client'
import {
  PaginatedList,
  PaginationParams,
} from '../../../api/types/pagination.type'

export abstract class CoreRepository<T> extends ContextSaver {
  protected transaction: DbTransactionalClient | null = null
  private _db: DbService

  constructor(
    db: DbService,
    private readonly modelName: (typeof Prisma.ModelName)[keyof typeof Prisma.ModelName],
  ) {
    super()
    this._db = db
  }

  setTransactionObject(transaction: DbTransactionalClient): void {
    this.transaction = transaction
  }

  getClient(tx: DbTransactionalClient): DbTransactionalClient | PrismaClient {
    return tx ? tx : this.transaction ? this.transaction : this._db
  }

  async findById(
    id: string,
    persistenceContext?: PersistenceContext,
  ): Promise<T | null> {
    const entities = (await this.getClient(persistenceContext?.tx)[
      this.lowercaseFirstChar(this.modelName)
    ].findUnique({
      where: { id },
    })) as T

    if (!entities) return null

    return entities
  }

  async findAll(
    args: PaginationParams,
    persistenceContext?: PersistenceContext,
  ): Promise<PaginatedList<T>> {
    const { limit, position } = args

    const total = await this.getClient(persistenceContext?.tx)[
      this.lowercaseFirstChar(this.modelName)
    ].count()

    const entities = (await this.getClient(persistenceContext?.tx)[
      this.lowercaseFirstChar(this.modelName)
    ].findMany({
      take: limit,
      skip: position,
    })) as T[]

    return {
      items: entities,
      pagination: {
        total,
        limit,
        position,
      },
    }
  }

  async edit(entity: T, persistenceContext?: PersistenceContext): Promise<T> {
    const { id, ...rest } = entity as any

    const updatedEntity = await this.getClient(persistenceContext?.tx)[
      this.lowercaseFirstChar(this.modelName)
    ].update({
      where: { id },
      data: rest,
    })

    return updatedEntity as T
  }

  async create(entity: T, persistenceContext?: PersistenceContext): Promise<T> {
    const createdEntity = await this.getClient(persistenceContext?.tx)[
      this.lowercaseFirstChar(this.modelName)
    ].create({
      data: entity,
    })

    return createdEntity
  }

  async delete(
    id: string,
    persistenceContext?: PersistenceContext,
  ): Promise<T> {
    const deletedEntity = await this.getClient(persistenceContext?.tx)[
      this.lowercaseFirstChar(this.modelName)
    ].delete({
      where: { id },
    })

    return deletedEntity
  }

  private lowercaseFirstChar(input: string): string {
    if (!input) return input
    return input.charAt(0).toLowerCase() + input.slice(1)
  }
}
