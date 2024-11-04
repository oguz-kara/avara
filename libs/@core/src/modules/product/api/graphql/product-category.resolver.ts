import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { IDInput } from '@avara/core/modules/user/application/graphql/input/id.input'
import { PaginationParamsInput } from '@avara/core/modules/user/application/graphql/input/pagination-params.input'
import { NameInput } from '@avara/core/modules/user/application/graphql/input/name.input'
import { Allow } from '@avara/shared/decorators/allow'
import { Permission } from '@avara/shared/enums/permission'
import {
  FindProductCategoryResponseType,
  ProductCategory,
} from '../../infrastructure/graphql/product-category.graphql'
import { ProductCategoryService } from '../../application/services/product-category.service'
import {
  CreateProductCategoryDto,
  RenameProductCategoryInput,
} from '../../application/graphql/dto/create-product-category.dto'

@Resolver(() => ProductCategory)
export class productCategoryResolver {
  constructor(
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @Allow(Permission.CREATE_ROLE_GLOBAL, Permission.WRITE_ROLE_GLOBAL)
  @Mutation(() => ProductCategory)
  async createProductCategory(
    @Args('input') createUserInput: CreateProductCategoryDto,
  ) {
    const productCategory =
      await this.productCategoryService.createProductCategory(createUserInput)

    return productCategory
  }

  @Allow(Permission.UPDATE_ROLE_GLOBAL, Permission.WRITE_ROLE_GLOBAL)
  @Mutation(() => ProductCategory)
  async renameProductCategoryById(
    @Args('input') renameInput: RenameProductCategoryInput,
  ) {
    const productCategory =
      await this.productCategoryService.renameProductCategory(renameInput.name)

    return productCategory
  }

  @Allow(Permission.DELETE_ROLE_GLOBAL, Permission.WRITE_ROLE_GLOBAL)
  @Mutation(() => ProductCategory)
  async removeProductCategoryById(
    @Args('input') removeproductCategoryInput: IDInput,
  ) {
    const productCategory =
      await this.productCategoryService.removeProductCategoryById(
        removeproductCategoryInput.id,
      )

    return productCategory
  }

  @Allow(Permission.READ_ROLE_GLOBAL)
  @Query(() => FindProductCategoryResponseType)
  async findProductCategorys(
    @Args('input', { nullable: true }) pagination?: PaginationParamsInput,
  ) {
    const productCategorysData =
      await this.productCategoryService.findMany(pagination)

    return productCategorysData
  }

  @Allow(Permission.READ_ROLE_GLOBAL)
  @Query(() => ProductCategory, { nullable: true })
  async findProductCategoryById(
    @Args('input') findproductCategoryInput: IDInput,
  ) {
    const { id } = findproductCategoryInput
    const productCategory = await this.productCategoryService.findById(id)

    return productCategory
  }

  @Allow(Permission.READ_ROLE_GLOBAL)
  @Query(() => ProductCategory, { nullable: true })
  async findProductCategoryByName(
    @Args('input') findproductCategoryInput: NameInput,
  ) {
    const { name } = findproductCategoryInput
    const productCategory = await this.productCategoryService.findByName(name)

    return productCategory
  }
}
