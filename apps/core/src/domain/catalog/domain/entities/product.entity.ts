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
import { JsonValue } from '@prisma/client/runtime/library'

// interface ProductProps {
//   id?: string
//   name: string
//   description?: string
//   featured_image?: Asset
//   documents?: Asset[]
//   images?: Asset[]
//   canonical_url?: string
//   og_title?: string
//   og_description?: string
//   og_image?: string
//   robots?: string
//   schema_markup?: JsonValue
//   hreflang?: string
//   page_type?: string
//   channels?: Channel[]
//   created_at?: Date
//   updated_at?: Date
// }

export class Product {
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

  static async create() {}

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

  private async validate() {
    const errors: ValidationError[] = await validate(this)
    if (errors.length > 0) {
      throw new DomainValidationError('Product', errors)
    }
  }
}
