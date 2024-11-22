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
      parentCategoryId: entity.parentCategoryId,
      metaFieldId: entity.metaFieldId,
      name: entity.name,
      categoryType: entity.categoryType as CategoryType,
      content: entity.content,
      contentType: entity.content,
      updatedBy: entity.updatedBy,
      createdBy: entity.createdBy,
      deletedBy: entity.deletedBy,
      deletedAt: entity.deletedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    })
  }

  toPersistence(entity: Category): CategoryPersistence {
    return {
      id: entity.id,
      parentCategoryId: entity.parentCategoryId,
      metaFieldId: entity.metaFieldId,
      name: entity.name,
      categoryType: entity.categoryType,
      content: entity.content,
      contentType: entity.contentType as ContentType,
      updatedBy: entity.updatedBy,
      createdBy: entity.createdBy,
      deletedBy: entity.deletedBy,
      deletedAt: entity.deletedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }
}
