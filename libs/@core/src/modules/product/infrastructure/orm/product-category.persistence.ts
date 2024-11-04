export interface ProductCategoryPersistence {
  id: string | null
  parent_category_id?: string
  meta_field_id?: string
  name: string
  mdx_content: string
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
  deleted_at?: Date
  deleted_by?: string
}
