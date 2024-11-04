import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ProductCategoryRepository } from '../../infrastructure/repositories/product-category.repository'
import { PaginationUtils } from '@avara/core/modules/user/application/utils/pagination.util'
import { CreateProductCategoryDto } from '../graphql/dto/create-product-category.dto'
import { ProductCategory } from '../../domain/entities/product-category.entity'
import { PaginationParams } from '@avara/core/modules/user/api/types/pagination.type'
import { PaginatedItemsResponse } from '@avara/core/modules/user/api/types/items-response.type'

@Injectable()
export class ProductCategoryService {
  constructor(
    private readonly repo: ProductCategoryRepository,
    private readonly paginationUtils: PaginationUtils,
  ) {}

  async createProductCategory(input: CreateProductCategoryDto) {
    const existedProductCategory = await this.repo.findByName(input.name)

    if (existedProductCategory)
      throw new ConflictException('The category already exists!')

    const productCategory = new ProductCategory({
      id: undefined,
      parent_category_id: input.parent_category_id,
      meta_field_id: input.meta_field_id,
      name: input.name,
      mdx_content: input.mdx_content,
    })

    await this.repo.save(productCategory)

    return productCategory
  }

  async findById(id: string): Promise<ProductCategory | null> {
    const productCategory = await this.repo.findById(id)

    return productCategory
  }

  async findByName(name: string): Promise<ProductCategory | null> {
    const productCategory = await this.repo.findByName(name)

    return productCategory
  }

  async findMany(
    params?: PaginationParams,
  ): Promise<PaginatedItemsResponse<ProductCategory>> {
    const { limit, position } =
      this.paginationUtils.validateAndGetPaginationLimit(params)

    const productCategorysData = await this.repo.findAll({
      limit,
      position,
    })

    return productCategorysData
  }

  async renameProductCategory(name: string) {
    if (!name) throw new NotFoundException('Category name is required!')

    const productCategory = await this.repo.findByName(name)

    if (productCategory)
      throw new ConflictException(
        'ProductCategory already exists! Try another name.',
      )

    productCategory.renameProductCategory(name)

    await this.repo.save(productCategory)

    return productCategory
  }

  async removeProductCategoryById(id: string) {
    const productCategory = await this.repo.findById(id)

    if (!productCategory)
      throw new NotFoundException('ProductCategory not found to remove!')

    const removedProductCategory = await this.repo.remove(id)

    return removedProductCategory
  }
}
