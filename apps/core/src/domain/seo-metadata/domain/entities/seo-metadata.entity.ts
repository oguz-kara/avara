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
  validate,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ValidationError } from '@nestjs/common'
import { DomainValidationError } from '@avara/shared/errors/domain-validation.error'

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

  constructor() {
    super()
  }

  static async create(args: SeoMetadataProps): Promise<SeoMetadata> {
    const seoMetadata = new SeoMetadata()
    if (args.id !== undefined) seoMetadata._id = args.id
    if (args.title !== undefined) seoMetadata._title = args.title
    if (args.description !== undefined)
      seoMetadata._description = args.description
    if (args.keywords !== undefined) seoMetadata._keywords = args.keywords
    if (args.version !== undefined) seoMetadata._version = args.version
    if (args.canonical_url !== undefined)
      seoMetadata._canonical_url = args.canonical_url
    if (args.og_title !== undefined) seoMetadata._og_title = args.og_title
    if (args.og_description !== undefined)
      seoMetadata._og_description = args.og_description
    if (args.og_image !== undefined) seoMetadata._og_image = args.og_image
    if (args.robots !== undefined) seoMetadata._robots = args.robots
    if (args.schema_markup !== undefined)
      seoMetadata._schema_markup = args.schema_markup
    if (args.hreflang !== undefined) seoMetadata._hreflang = args.hreflang
    if (args.page_type !== undefined) seoMetadata._page_type = args.page_type
    if (args.channels !== undefined) seoMetadata._channels = args.channels

    await seoMetadata.validate()

    return seoMetadata
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

  public async edit(
    args: Partial<Omit<SeoMetadataProps, 'id'>>,
  ): Promise<void> {
    if (args.title !== undefined) this._title = args.title
    if (args.description !== undefined) this._description = args.description
    if (args.keywords !== undefined) this._keywords = args.keywords
    if (args.version !== undefined) this._version = args.version
    if (args.canonical_url !== undefined)
      this._canonical_url = args.canonical_url
    if (args.og_title !== undefined) this._og_title = args.og_title
    if (args.og_description !== undefined)
      this._og_description = args.og_description
    if (args.og_image !== undefined) this._og_image = args.og_image
    if (args.robots !== undefined) this._robots = args.robots
    if (args.schema_markup !== undefined)
      this._schema_markup = args.schema_markup
    if (args.hreflang !== undefined) this._hreflang = args.hreflang
    if (args.page_type !== undefined) this._page_type = args.page_type
    if (args.channels !== undefined) this._channels = args.channels

    await this.validate()
  }

  private async validate() {
    const errors: ValidationError[] = await validate(this)
    if (errors.length > 0) {
      throw new DomainValidationError('SeoMetadata', errors)
    }
  }
}
