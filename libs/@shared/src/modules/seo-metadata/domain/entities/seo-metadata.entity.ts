import { ChannelListAwareEntity } from '@avara/shared/modules/channel/domain/entities/channel-list-aware.entity'
import { JsonValue } from '../../infrastructure/types/json.type'
import { Channel } from '@avara/shared/modules/channel/domain/entities/channel.entity'

interface SeoMetadataProps {
  id?: string
  title: string
  description: string
  keywords: string
  version: number
  cannonical_url?: string
  og_title?: string
  og_description?: string
  og_image?: string
  robots?: string
  schema_markup?: JsonValue
  hreflang?: string
  page_type?: string
  channels?: Channel[]
  created_at?: Date
  updated_at?: Date
}

export class SeoMetadata extends ChannelListAwareEntity {
  private _title: string
  private _description: string
  private _keywords: string
  private _version: number

  private _cannonical_url?: string
  private _og_title?: string
  private _og_description?: string
  private _og_image?: string
  private _robots?: string
  private _schema_markup?: JsonValue
  private _hreflang?: string
  private _page_type?: string
  protected _channels: Channel[]

  constructor(props: SeoMetadataProps) {
    super()
    this._id = props.id
    this._title = props.title
    this._description = props.description
    this._keywords = props.keywords
    this._version = props.version
    this._cannonical_url = props.cannonical_url
    this._og_title = props.og_title
    this._og_description = props.og_description
    this._og_image = props.og_image
    this._robots = props.robots
    this._schema_markup = props.schema_markup
    this._hreflang = props.hreflang
    this._page_type = props.page_type
    this._channels = props.channels
  }

  get title(): string {
    return this._title
  }

  get description(): string {
    return this._description
  }

  get keywords(): string {
    return this._keywords
  }

  get version(): number {
    return this._version
  }

  get cannonical_url(): string | undefined {
    return this._cannonical_url
  }

  get og_title(): string | undefined {
    return this._og_title
  }

  get og_description(): string | undefined {
    return this._og_description
  }

  get og_image(): string | undefined {
    return this._og_image
  }

  get robots(): string | undefined {
    return this._robots
  }

  get schema_markup(): JsonValue | undefined {
    return this._schema_markup
  }

  get hreflang(): string | undefined {
    return this._hreflang
  }

  get page_type(): string | undefined {
    return this._page_type
  }
}
