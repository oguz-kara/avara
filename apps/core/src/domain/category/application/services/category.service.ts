import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PaginationUtils } from '@avara/shared/utils/pagination.util'
import { Category } from '../../domain/entities/category.entity'
import { PaginationParams } from '@avara/core/domain/user/api/types/pagination.type'
import { PaginatedItemsResponse } from '@avara/core/domain/user/api/types/items-response.type'
import { CategoryType } from '../enums/category.enum'
import { CreateCategoryDto } from '../../api/graphql/dto/create-category.dto'
import { CoreRepositories } from '@avara/core/application/core-repositories'
import { RequestContext } from '@avara/core/application/context/request-context'

@Injectable()
export class CategoryService {
  constructor(
    private readonly repositories: CoreRepositories,
    private readonly paginationUtils: PaginationUtils,
  ) {}

  async createCategory(ctx: RequestContext, input: CreateCategoryDto) {
    const repo = this.repositories.get(ctx, 'Category')

    const existedCategory = await repo.findByNameAndType(
      input.name,
      input.categoryType,
    )

    if (existedCategory)
      throw new ConflictException('The category already exists!')

    const category = new Category({
      id: undefined,
      parentCategoryId: input.parentCategoryId,
      categoryType: input.categoryType,
      metaFieldId: input.metaFieldId,
      name: input.name,
      content: input.content,
      contentType: input.contentType,
    })

    await repo.saveResourceToChannel(category)

    return category
  }

  async findById(ctx: RequestContext, id: string): Promise<Category | null> {
    const repo = this.repositories.get(ctx, 'Category')

    const category = await repo.findOneInChannel(id)

    return category
  }

  async findByNameAndType(
    ctx: RequestContext,
    name: string,
    type: CategoryType,
  ): Promise<Category | null> {
    const repo = this.repositories.get(ctx, 'Category')

    const category = await repo.findByNameAndType(name, type)

    return category
  }

  async findManyByType(
    ctx: RequestContext,
    params?: PaginationParams & { type: CategoryType },
  ): Promise<PaginatedItemsResponse<Category>> {
    const { type, ...paginationParams } = params

    const repo = this.repositories.get(ctx, 'Category')

    const { limit, position } =
      this.paginationUtils.validateAndGetPaginationLimit(paginationParams)

    const categoriesData = await repo.findManyByType({
      limit,
      position,
      type,
    })

    return categoriesData
  }

  async removeProductCategoryById(ctx: RequestContext, id: string) {
    const repo = this.repositories.get(ctx, 'Category')

    const category = await repo.findOneInChannel(id)

    if (!category)
      throw new NotFoundException('ProductCategory not found to remove!')

    await repo.removeResourceInChannel(category)

    return category
  }
}
