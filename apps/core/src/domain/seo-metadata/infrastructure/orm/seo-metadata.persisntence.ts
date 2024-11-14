import { ChannelPersistence } from '@avara/core/domain/channel/infrastructure/orm/channel.persistence'
import { JsonValue } from '../types/json.type'

export interface SeoMetadataPersistence {
  id: string
  title: string
  description: string
  keywords: string
  version: number
  canonical_url?: string
  og_title?: string
  og_description?: string
  og_image?: string
  robots?: string
  channels: ChannelPersistence[]
  schema_markup?: JsonValue
  hreflang?: string
  page_type?: string
  created_at?: Date
  updated_at?: Date
}
