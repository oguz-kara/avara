import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { PaginationParamsInput } from '@avara/shared/graphql/inputs/pagination-params.input'
import { Allow } from '@avara/shared/decorators/allow'
import { Permission } from '@avara/shared/enums/permission'
import { RequestContext } from '@avara/core/application/context/request-context'
import { Ctx } from '@avara/core/application/context/request-context.decorator'
import { IDInput } from '@avara/core/domain/user/application/graphql/input/id.input'
import { Relations } from '@avara/core/application/relations.decorator'
import { FindProductsResponseType, ProductType } from '../types/product.graphql'
import { CreateProductDto, EditProductDto } from '../dto/product.dto'
import { ProductService } from '../../../application/services/product.service'

@Resolver(() => ProductType)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Allow(Permission.READ_PRODUCT_GLOBAL)
  @Query(() => FindProductsResponseType)
  async products(
    @Ctx() ctx: RequestContext,
    @Args('input', { nullable: true }) pagination?: PaginationParamsInput,
    @Relations({ depth: 5 }) relations?: Record<string, object | boolean>,
  ) {
    return await this.productService.getProductsWithPagination(
      ctx,
      pagination,
      {
        relations,
      },
    )
  }

  @Allow(Permission.READ_PRODUCT_GLOBAL)
  @Query(() => ProductType, { nullable: true })
  async productById(
    @Ctx() ctx: RequestContext,
    @Args('paging') findProductInput: IDInput,
    @Relations({ depth: 5 }) relations?: Record<string, object | boolean>,
  ) {
    const { id } = findProductInput
    return await this.productService.getProductById(ctx, id, { relations })
  }

  @Allow(Permission.CREATE_PRODUCT_GLOBAL, Permission.WRITE_PRODUCT_GLOBAL)
  @Mutation(() => ProductType)
  async registerProduct(
    @Ctx() ctx: RequestContext,
    @Args('input') createProductDto?: CreateProductDto,
  ) {
    return await this.productService.createNewProduct(ctx, createProductDto)
  }

  @Allow(Permission.UPDATE_PRODUCT_GLOBAL, Permission.WRITE_PRODUCT_GLOBAL)
  @Mutation(() => ProductType)
  async editProduct(
    @Ctx() ctx: RequestContext,
    @Args('id') id?: string,
    @Args('input') editProductDto?: EditProductDto,
  ) {
    return await this.productService.editProduct(ctx, id, editProductDto)
  }

  @Allow(Permission.DELETE_PRODUCT_GLOBAL, Permission.WRITE_PRODUCT_GLOBAL)
  @Mutation(() => ProductType)
  async terminateProduct(@Ctx() ctx: RequestContext, @Args('id') id?: string) {
    return await this.productService.deleteProduct(ctx, id)
  }
}
