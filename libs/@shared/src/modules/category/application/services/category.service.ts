import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CategoryRepository } from '../../infrastructure/repositories/category.repository'
import { PaginationUtils } from '@avara/shared/utils/pagination.util'
import { Category } from '../../domain/entities/category.entity'
import { PaginationParams } from '@avara/core/modules/user/api/types/pagination.type'
import { PaginatedItemsResponse } from '@avara/core/modules/user/api/types/items-response.type'
import { CategoryType } from '../enums/category.enum'
import { CreateCategoryDto } from '../../api/graphql/dto/create-category.dto'

@Injectable()
export class CategoryService {
  constructor(
    private readonly repo: CategoryRepository,
    private readonly paginationUtils: PaginationUtils,
  ) {}

  async createCategory(input: CreateCategoryDto) {
    const existedCategory = await this.repo.findByNameAndType(
      input.name,
      input.category_type,
    )

    if (existedCategory)
      throw new ConflictException('The category already exists!')

    const category = new Category({
      id: undefined,
      parent_category_id: input.parent_category_id,
      category_type: input.category_type,
      meta_field_id: input.meta_field_id,
      name: input.name,
      content: input.content,
      content_type: input.content_type,
    })

    await this.repo.saveResourceToChannel(category)

    return category
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.repo.findOneInChannel(id)

    return category
  }

  async findByNameAndType(
    name: string,
    type: CategoryType,
  ): Promise<Category | null> {
    const category = await this.repo.findByNameAndType(name, type)

    return category
  }

  async findManyByType(
    params?: PaginationParams & { type: CategoryType },
  ): Promise<PaginatedItemsResponse<Category>> {
    const { type, ...paginationParams } = params

    const { limit, position } =
      this.paginationUtils.validateAndGetPaginationLimit(paginationParams)

    const categoriesData = await this.repo.findManyByType({
      limit,
      position,
      type,
    })

    return categoriesData
  }

  async removeProductCategoryById(id: string) {
    const category = await this.repo.findOneInChannel(id)

    if (!category)
      throw new NotFoundException('ProductCategory not found to remove!')

    const removedCategory = await this.repo.removeResourceInChannel(category)

    return removedCategory
  }
}
