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
} from '@avara/core/database/channel-aware-repository.interface'

@Injectable()
export class CategoryRepository
  extends ContextSaver
  implements
    ChannelResourceSaver<Category>,
    ChannelResourceRemover<Category>,
    ChannelResourceFinder<Category>
{
  constructor(
    private readonly db: DbService,
    private readonly mapper: CategoryMapper,
  ) {
    super()
  }

  async saveResourceToChannel(entity: Category): Promise<void> {
    if (entity.id) {
      const persistence = this.mapper.toPersistence(entity)

      const result = await this.db.category.update({
        where: {
          id: entity.id,
          channels: {
            some: {
              id: this.ctx.channel_id,
            },
          },
        },
        data: {
          ...persistence,
          channels: {
            connect: {
              id: this.ctx.channel_id,
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

      const result = await this.db.category.create({
        data: {
          ...persistence,
          channels: {
            connect: {
              id: this.ctx.channel_id,
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

  async removeResourceInChannel(category: Category): Promise<void> {
    await this.db.category.delete({
      where: {
        id: category.id,
        channels: {
          some: {
            id: this.ctx.channel_id,
          },
        },
      },
    })
  }

  async findOneInChannel(id: string): Promise<Category | null> {
    const result = await this.db.category.findUnique({
      where: {
        id,
        channels: {
          some: {
            id: this.ctx.channel_id,
          },
        },
      },
    })

    if (!result) return null

    return this.mapper.toDomain(result)
  }

  async findManyInChannel(
    args: PaginationParams,
  ): Promise<PaginatedList<Category>> {
    const result = await this.db.category.findMany({
      where: {
        channels: {
          some: {
            id: this.ctx.channel_id,
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
  ): Promise<Category | null> {
    const category = await this.db.category.findFirst({
      where: {
        AND: [
          {
            name,
          },
          {
            category_type: type as CategoryType,
          },
          {
            channels: {
              some: {
                id: this.ctx.channel_id,
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
  ): Promise<PaginatedList<Category> | null> {
    const result = await this.db.category.findMany({
      where: {
        AND: [
          {
            category_type: params.type,
          },
          {
            channels: {
              some: {
                id: this.ctx.channel_id,
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
