export interface ChannelPersistence {
  id: string | null
  code: string
  name: string
  default_language_code: string
  currency_code: string
  is_default: boolean
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
  deleted_at?: Date
  deleted_by?: string
}
