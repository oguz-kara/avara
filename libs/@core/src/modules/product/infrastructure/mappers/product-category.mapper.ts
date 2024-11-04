import { Injectable } from '@nestjs/common'
import { Mapper } from '@avara/shared/database/mapper.interface'
import { ProductCategoryPersistence } from '../orm/product-category.persistence'
import { ProductCategory } from '../../domain/entities/product-category.entity'

@Injectable()
export class ProductCategoryMapper
  implements Mapper<ProductCategory, ProductCategoryPersistence>
{
  toDomain(entity: ProductCategoryPersistence): ProductCategory {
    return new ProductCategory({
      id: entity.id,
      parent_category_id: entity.parent_category_id,
      meta_field_id: entity.meta_field_id,
      name: entity.name,
      mdx_content: entity.mdx_content,
      updated_by: entity.updated_by,
      created_by: entity.created_by,
      deleted_by: entity.deleted_by,
      deleted_at: entity.deleted_at,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    })
  }

  toPersistence(entity: ProductCategory): ProductCategoryPersistence {
    return {
      id: entity.id,
      parent_category_id: entity.parent_category_id,
      meta_field_id: entity.meta_field_id,
      name: entity.name,
      mdx_content: entity.mdx_content,
      updated_by: entity.updated_by,
      created_by: entity.created_by,
      deleted_by: entity.deleted_by,
      deleted_at: entity.deleted_at,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    }
  }
}
