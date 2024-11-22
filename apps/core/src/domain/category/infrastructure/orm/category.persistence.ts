import { CategoryType as AppCategoryType } from '../../application/enums/category.enum'

import { CategoryType, ContentType } from '@prisma/client'

export interface CategoryPersistence {
  id: string | null
  parentCategoryId?: string
  metaFieldId?: string
  categoryType: CategoryType | AppCategoryType
  name: string
  content: string
  contentType: ContentType
  createdAt?: Date
  createdBy?: string
  updatedAt?: Date
  updatedBy?: string
  deletedAt?: Date
  deletedBy?: string
}
