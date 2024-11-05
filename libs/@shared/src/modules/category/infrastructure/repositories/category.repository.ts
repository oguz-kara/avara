import { ConflictException, Injectable } from '@nestjs/common'
import { Category } from '../../domain/entities/category.entity'
import { DbService } from '@avara/shared/database/db-service'
import { CategoryMapper } from '../mappers/category.mapper'
import { CategoryType } from '@prisma/client'
import { CategoryType as AppCategoryType } from '@avara/shared/modules/category/application/enums/category.enum'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/modules/user/api/types/pagination.type'

@Injectable()
export class CategoryRepository {
  constructor(
    private readonly db: DbService,
    private readonly mapper: CategoryMapper,
  ) {}

  async save(entity: Category): Promise<void> {
    if (entity.id) {
      const persistence = this.mapper.toPersistence(entity)

      const result = await this.db.category.update({
        where: {
          id: entity.id,
        },
        data: persistence,
      })

      if (!result)
        throw new ConflictException(
          `An error occurred when updating the category!`,
        )
    } else {
      const persistence = this.mapper.toPersistence(entity)

      const result = await this.db.category.create({
        data: persistence,
      })

      if (!result?.id)
        throw new ConflictException(
          `An error occurred when creating the category!`,
        )

      entity.assignId(result.id)
    }
  }

  async remove(id: string): Promise<Category> {
    const result = await this.db.category.delete({
      where: {
        id,
      },
    })

    return this.mapper.toDomain(result)
  }

  async findById(id: string): Promise<Category | null> {
    const result = await this.db.category.findUnique({
      where: {
        id,
      },
    })

    if (!result) return null

    return this.mapper.toDomain(result)
  }

  async findAll(args: PaginationParams): Promise<PaginatedList<Category>> {
    const result = await this.db.category.findMany()

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
    const productCategory = await this.db.category.findFirst({
      where: {
        AND: [
          {
            name,
          },
          {
            category_type: type as CategoryType,
          },
        ],
      },
    })

    if (!productCategory) return null

    return this.mapper.toDomain(productCategory)
  }

  async findManyByType(
    params: PaginationParams & { type: CategoryType },
  ): Promise<PaginatedList<Category> | null> {
    const result = await this.db.category.findMany({
      where: {
        category_type: params.type,
      },
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
