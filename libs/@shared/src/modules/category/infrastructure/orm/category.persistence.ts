import { CategoryType as AppCategoryType } from '../../application/enums/category.enum'

import { CategoryType, ContentType } from '@prisma/client'

export interface CategoryPersistence {
  id: string | null
  parent_category_id?: string
  meta_field_id?: string
  category_type: CategoryType | AppCategoryType
  name: string
  content: string
  content_type: ContentType
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
  deleted_at?: Date
  deleted_by?: string
}
