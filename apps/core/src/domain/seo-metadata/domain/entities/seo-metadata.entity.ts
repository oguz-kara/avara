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
  canonicalUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  robots?: string
  schemaMarkup?: JsonValue
  hreflang?: string
  pageType?: string
  channels?: Channel[]
  createdAt?: Date
  updatedAt?: Date
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
  private _canonicalUrl?: string

  @IsOptional()
  @IsString()
  private _ogTitle?: string

  @IsOptional()
  @IsString()
  private _ogDescription?: string

  @IsOptional()
  @IsString()
  private _ogImage?: string

  @IsOptional()
  @IsString()
  private _robots?: string

  @IsOptional()
  @IsString()
  private _schemaMarkup?: JsonValue

  @IsOptional()
  @IsString()
  private _hreflang?: string

  @IsOptional()
  @IsString()
  private _pageType?: string

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
    this._canonicalUrl = props.canonicalUrl
    this._ogTitle = props.ogTitle
    this._ogDescription = props.ogDescription
    this._ogImage = props.ogImage
    this._robots = props.robots
    this._schemaMarkup = props.schemaMarkup
    this._hreflang = props.hreflang
    this._pageType = props.pageType
    this._channels = props.channels ?? []
    this._createdAt = props.createdAt ?? new Date()
    this._updatedAt = props.updatedAt
  }

  static create(props: SeoMetadataProps): SeoMetadata {
    const seoMetadata = new SeoMetadata(props)
    seoMetadata.validateSync('SeoMetadata')
    return seoMetadata
  }

  public edit(args: Partial<Omit<SeoMetadataProps, 'id'>>): void {
    Object.entries(args).forEach(([key, value]) => {
      if (value !== undefined && `_${key}` in this) {
        this[`${key}`] = value
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

  get canonicalUrl(): string | undefined {
    return this._canonicalUrl
  }

  get ogTitle(): string | undefined {
    return this._ogTitle
  }

  get ogDescription(): string | undefined {
    return this._ogDescription
  }

  get ogImage(): string | undefined {
    return this._ogImage
  }

  get robots(): string | undefined {
    return this._robots
  }

  get schemaMarkup(): JsonValue | undefined {
    return this._schemaMarkup
  }

  get hreflang(): string | undefined {
    return this._hreflang
  }

  get pageType(): string | undefined {
    return this._pageType
  }

  get channels(): Channel[] {
    return this._channels
  }
}
