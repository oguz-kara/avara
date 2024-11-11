import { Injectable } from '@nestjs/common'
import { Mapper } from '@avara/shared/database/mapper.interface'
import { CategoryPersistence } from '../orm/category.persistence'
import { Category } from '../../domain/entities/category.entity'
import { CategoryType } from '../../application/enums/category.enum'
import { ContentType } from '@prisma/client'

@Injectable()
export class CategoryMapper implements Mapper<Category, CategoryPersistence> {
  toDomain(entity: CategoryPersistence): Category {
    return new Category({
      id: entity.id,
      parent_category_id: entity.parent_category_id,
      meta_field_id: entity.meta_field_id,
      name: entity.name,
      category_type: entity.category_type as CategoryType,
      content: entity.content,
      content_type: entity.content,
      updated_by: entity.updated_by,
      created_by: entity.created_by,
      deleted_by: entity.deleted_by,
      deleted_at: entity.deleted_at,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    })
  }

  toPersistence(entity: Category): CategoryPersistence {
    return {
      id: entity.id,
      parent_category_id: entity.parent_category_id,
      meta_field_id: entity.meta_field_id,
      name: entity.name,
      category_type: entity.category_type,
      content: entity.content,
      content_type: entity.content_type as ContentType,
      updated_by: entity.updated_by,
      created_by: entity.created_by,
      deleted_by: entity.deleted_by,
      deleted_at: entity.deleted_at,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    }
  }
}
