import { ChannelListAwareEntity } from '@avara/core/domain/channel/domain/entities/channel-list-aware.entity'
import { JsonValue } from '../../infrastructure/types/json.type'
import { Channel } from '@avara/core/domain/channel/domain/entities/channel.entity'
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

interface SeoMetadataProps {
  id?: string
  title: string
  description: string
  keywords: string
  version: number
  canonical_url?: string
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
  @IsString()
  @MaxLength(60)
  @MinLength(3)
  private _title: string

  @IsString()
  @MaxLength(160)
  private _description: string

  @IsString()
  @MaxLength(5000)
  private _keywords: string

  @IsNumber()
  private _version: number

  @IsOptional()
  @IsString()
  private _canonical_url?: string

  @IsOptional()
  @IsString()
  private _og_title?: string

  @IsOptional()
  @IsString()
  private _og_description?: string

  @IsOptional()
  @IsString()
  private _og_image?: string

  @IsOptional()
  @IsString()
  private _robots?: string

  @IsOptional()
  @IsString()
  private _schema_markup?: JsonValue

  @IsOptional()
  @IsString()
  private _hreflang?: string

  @IsOptional()
  @IsString()
  private _page_type?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Channel)
  protected _channels: Channel[]

  private constructor(props: SeoMetadataProps) {
    super()
    this._id = props.id
    this._title = props.title
    this._description = props.description
    this._keywords = props.keywords
    this._version = props.version
    this._canonical_url = props.canonical_url
    this._og_title = props.og_title
    this._og_description = props.og_description
    this._og_image = props.og_image
    this._robots = props.robots
    this._schema_markup = props.schema_markup
    this._hreflang = props.hreflang
    this._page_type = props.page_type
    this._channels = props.channels ?? []
    this._created_at = props.created_at ?? new Date()
    this._updated_at = props.updated_at
  }

  static create(props: SeoMetadataProps): SeoMetadata {
    const seoMetadata = new SeoMetadata(props)
    seoMetadata.validateSync('SeoMetadata')
    return seoMetadata
  }

  public edit(args: Partial<Omit<SeoMetadataProps, 'id'>>): void {
    Object.entries(args).forEach(([key, value]) => {
      if (value !== undefined && key in this) {
        this[`_${key}`] = value
      }
    })

    this.validateSync('SeoMetadata')
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

  get canonical_url(): string | undefined {
    return this._canonical_url
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

  get channels(): Channel[] {
    return this._channels
  }
}
