import { Injectable } from '@nestjs/common'
import { PaginationUtils } from '../../../../../../../libs/@shared/src/utils/pagination.util'
import { RequestContext } from '@avara/core/application/context/request-context'
import { DbService } from '@avara/shared/database/db-service'
import { Product } from '@avara/core/domain/catalog/infrastructure/types'
import { PaginationParams } from '@avara/core/domain/user/api/types/pagination.type'
import { PaginatedItemsResponse } from '@avara/core/domain/user/api/types/items-response.type'
import { ID } from '@avara/shared/types/id.type'
import { PersistenceContext } from '@avara/core/database/channel-aware-repository.interface'
import {
  CreateProductDto,
  EditProductDto,
} from '../../api/graphql/dto/product.dto'

@Injectable()
export class ProductService {
  constructor(
    private readonly db: DbService,
    private readonly paginationUtils: PaginationUtils,
  ) {}

  async getProductById(
    ctx: RequestContext,
    id: ID,
    persistenceContext?: PersistenceContext,
  ): Promise<Product | null> {
    const product = await this.db.product.findUnique({
      where: { id, channels: { some: { id: ctx.channelId } } },
      include: persistenceContext?.relations ?? undefined,
    })

    return product
  }

  async getProductsWithPagination(
    ctx: RequestContext,
    params: PaginationParams,
    persistenceContext?: PersistenceContext,
  ): Promise<PaginatedItemsResponse<Product>> {
    const { limit, position } =
      this.paginationUtils.validateAndGetPaginationLimit(params)

    const products = await this.db.product.findMany({
      where: { channels: { some: { id: ctx.channelId } } },
      take: limit,
      skip: position,
      include: persistenceContext?.relations ?? undefined,
    })

    const total = await this.db.product.count()

    return {
      items: products,
      pagination: {
        limit,
        position,
        total,
      },
    }
  }

  async createNewProduct(
    ctx: RequestContext,
    product: CreateProductDto,
  ): Promise<Product> {
    const createdProduct = await this.db.product.create({
      data: { ...product, channels: { connect: { id: ctx.channelId } } },
    })

    return createdProduct
  }

  async editProduct(
    ctx: RequestContext,
    id: ID,
    product: EditProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.db.product.update({
      where: { id, channels: { some: { id: ctx.channelId } } },
      data: product,
    })

    return updatedProduct
  }

  async deleteProduct(ctx: RequestContext, id: ID): Promise<Product> {
    const deletedProduct = await this.db.product.delete({
      where: { id, channels: { some: { id: ctx.channelId } } },
    })

    return deletedProduct
  }
}
