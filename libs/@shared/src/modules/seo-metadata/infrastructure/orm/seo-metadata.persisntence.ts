import { ChannelPersistence } from '@avara/shared/modules/channel/infrastructure/orm/channel.persistence'
import { JsonValue } from '../types/json.type'

export interface SeoMetadataPersistence {
  title: string
  description: string
  keywords: string
  version: number
  cannonical_url?: string
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
