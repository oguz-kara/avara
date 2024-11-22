import { ConflictException, Injectable } from '@nestjs/common'
import { Category } from '../../domain/entities/category.entity'
import { DbService } from '@avara/shared/database/db-service'
import { CategoryMapper } from '../mappers/category.mapper'
import { CategoryType } from '@prisma/client'
import { CategoryType as AppCategoryType } from '@avara/core/domain/category/application/enums/category.enum'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/domain/user/api/types/pagination.type'
import {
  ChannelResourceFinder,
  ChannelResourceRemover,
  ChannelResourceSaver,
  ContextSaver,
  PersistenceContext,
} from '@avara/core/database/channel-aware-repository.interface'
import { PrismaClient } from '@prisma/client'
import { TransactionAware } from '@avara/shared/database/transaction-aware.abstract'
import { DbTransactionalClient } from '@avara/shared/database/db-transactional-client'

@Injectable()
export class CategoryRepository
  extends ContextSaver
  implements
    ChannelResourceSaver<Category>,
    ChannelResourceRemover<Category>,
    ChannelResourceFinder<Category>,
    TransactionAware
{
  transaction: DbTransactionalClient | null = null

  constructor(
    private readonly db: DbService,
    private readonly mapper: CategoryMapper,
  ) {
    super()
  }

  setTransactionObject(transaction: DbTransactionalClient): void {
    this.transaction = transaction
  }

  getClient(tx?: DbTransactionalClient): DbTransactionalClient | PrismaClient {
    return tx ? tx : this.transaction ? this.transaction : this.db
  }

  async saveResourceToChannel(
    entity: Category,
    persistenceContext?: PersistenceContext,
  ): Promise<void> {
    const client = this.getClient(persistenceContext?.tx)
    if (entity.id) {
      const persistence = this.mapper.toPersistence(entity)

      const result = await client.category.update({
        where: {
          id: entity.id,
          channels: {
            some: {
              id: this.ctx.channelId,
            },
          },
        },
        data: {
          ...persistence,
          channels: {
            connect: {
              id: this.ctx.channelId,
            },
          },
        },
      })

      if (!result)
        throw new ConflictException(
          `An error occurred when updating the category!`,
        )
    } else {
      const persistence = this.mapper.toPersistence(entity)

      const result = await client.category.create({
        data: {
          ...persistence,
          channels: {
            connect: {
              id: this.ctx.channelId,
            },
          },
        },
      })

      if (!result?.id)
        throw new ConflictException(
          `An error occurred when creating the category!`,
        )

      entity.assignId(result.id)
    }
  }

  async removeResourceInChannel(
    category: Category,
    persistenceContext?: PersistenceContext,
  ): Promise<void> {
    const client = this.getClient(persistenceContext?.tx)
    await client.category.delete({
      where: {
        id: category.id,
        channels: {
          some: {
            id: this.ctx.channelId,
          },
        },
      },
    })
  }

  async findOneInChannel(
    id: string,
    persistenceContext?: PersistenceContext,
  ): Promise<Category | null> {
    const client = this.getClient(persistenceContext?.tx)
    const result = await client.category.findUnique({
      where: {
        id,
        channels: {
          some: {
            id: this.ctx.channelId,
          },
        },
      },
    })

    if (!result) return null

    return this.mapper.toDomain(result)
  }

  async findManyInChannel(
    args: PaginationParams,
    persistenceContext?: PersistenceContext,
  ): Promise<PaginatedList<Category>> {
    const client = this.getClient(persistenceContext?.tx)
    const result = await client.category.findMany({
      where: {
        channels: {
          some: {
            id: this.ctx.channelId,
          },
        },
      },
    })

    return {
      items: result.map((item) => this.mapper.toDomain(item)),
      pagination: {
        total: result.length,
        limit: args.limit,
        position: args.position,
      },
    }
  }

  async findByNameAndType(
    name: string,
    type: CategoryType | AppCategoryType,
    persistenceContext?: PersistenceContext,
  ): Promise<Category | null> {
    const client = this.getClient(persistenceContext?.tx)
    const category = await client.category.findFirst({
      where: {
        AND: [
          {
            name,
          },
          {
            categoryType: type as CategoryType,
          },
          {
            channels: {
              some: {
                id: this.ctx.channelId,
              },
            },
          },
        ],
      },
    })

    if (!category) return null

    return this.mapper.toDomain(category)
  }

  async findManyByType(
    params: PaginationParams & { type: CategoryType },
    persistenceContext?: PersistenceContext,
  ): Promise<PaginatedList<Category> | null> {
    const client = this.getClient(persistenceContext?.tx)
    const result = await client.category.findMany({
      where: {
        AND: [
          {
            categoryType: params.type,
          },
          {
            channels: {
              some: {
                id: this.ctx.channelId,
              },
            },
          },
        ],
      },
      take: params?.limit,
      skip: params?.position,
    })

    return {
      items: result.map((item) => this.mapper.toDomain(item)),
      pagination: {
        total: result.length,
        limit: params.limit,
        position: params.position,
      },
    }
  }
}
