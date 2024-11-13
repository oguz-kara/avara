import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { IDInput } from '@avara/core/user/application/graphql/input/id.input'
import { Allow } from '@avara/shared/decorators/allow'
import { Permission } from '@avara/shared/enums/permission'
import {
  FindProductCategoryResponseType,
  Category,
} from '../types/category.graphql'
import { CategoryService } from '../../../application/services/category.service'
import { CreateCategoryDto } from '../dto/create-category.dto'
import { FindCategoriesByTypeInput } from '../inputs/find-categories-by-type.input'
import { FindByNameAndTypeInput } from '../inputs/find-by-name-and-type.input'

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly productCategoryService: CategoryService) {}

  @Allow(
    Permission.CREATE_PRODUCT_CATEGORY_GLOBAL,
    Permission.WRITE_PRODUCT_CATEGORY_GLOBAL,
  )
  @Mutation(() => Category)
  async createCategory(@Args('input') createUserInput: CreateCategoryDto) {
    const productCategory =
      await this.productCategoryService.createCategory(createUserInput)

    return productCategory
  }

  @Allow(
    Permission.DELETE_PRODUCT_CATEGORY_GLOBAL,
    Permission.WRITE_PRODUCT_CATEGORY_GLOBAL,
  )
  @Mutation(() => Category)
  async removeCategoryById(@Args('input') removeproductCategoryInput: IDInput) {
    const productCategory =
      await this.productCategoryService.removeProductCategoryById(
        removeproductCategoryInput.id,
      )

    return productCategory
  }

  @Allow(Permission.READ_PRODUCT_CATEGORY_GLOBAL)
  @Query(() => FindProductCategoryResponseType)
  async categories(
    @Args('input', { nullable: true })
    findCategoriesInput?: FindCategoriesByTypeInput,
  ) {
    const productCategorysData =
      await this.productCategoryService.findManyByType(findCategoriesInput)

    return productCategorysData
  }

  @Allow(Permission.READ_PRODUCT_CATEGORY_GLOBAL)
  @Query(() => Category, { nullable: true })
  async findCategoryById(@Args('input') findproductCategoryInput: IDInput) {
    const { id } = findproductCategoryInput
    const productCategory = await this.productCategoryService.findById(id)

    return productCategory
  }

  @Allow(Permission.READ_PRODUCT_CATEGORY_GLOBAL)
  @Query(() => Category, { nullable: true })
  async findCategoryByName(@Args('input') findInput: FindByNameAndTypeInput) {
    const { name, type } = findInput

    const productCategory = await this.productCategoryService.findByNameAndType(
      name,
      type,
    )

    return productCategory
  }
}
