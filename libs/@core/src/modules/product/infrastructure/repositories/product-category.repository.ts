import { BaseRepository } from '@avara/shared/database/base-repository'
import { Injectable } from '@nestjs/common'
import { ProductCategory } from '../../domain/entities/product-category.entity'
import { ProductCategoryPersistence } from '../orm/product-category.persistence'
import { DbService } from '@avara/shared/database/db-service'
import { ProductCategoryMapper } from '../mappers/product-category.mapper'

@Injectable()
export class ProductCategoryRepository extends BaseRepository<
  ProductCategory,
  ProductCategoryPersistence
> {
  constructor(
    protected readonly db: DbService,
    protected readonly productCategoryMapper: ProductCategoryMapper,
  ) {
    super(db, 'productCategory', productCategoryMapper)
  }

  async findByName(name: string): Promise<ProductCategory | null> {
    const productCategory = await this.db.productCategory.findUnique({
      where: {
        name,
      },
    })

    if (!productCategory) return null

    return this.mapper.toDomain(productCategory)
  }
}
