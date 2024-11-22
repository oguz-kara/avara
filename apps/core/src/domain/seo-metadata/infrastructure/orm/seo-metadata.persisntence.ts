import { ChannelPersistence } from '@avara/core/domain/channel/infrastructure/orm/channel.persistence'
import { JsonValue } from '../types/json.type'

export interface SeoMetadataPersistence {
  id: string
  title: string
  description: string
  keywords: string
  version: number
  canonicalUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  robots?: string
  channels: ChannelPersistence[]
  schemaMarkup?: JsonValue
  hreflang?: string
  pageType?: string
  createdAt?: Date
  updatedAt?: Date
}
