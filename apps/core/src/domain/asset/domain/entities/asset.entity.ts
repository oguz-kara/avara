import { ChannelListAwareEntity } from '@avara/core/domain/channel/domain/entities/channel-list-aware.entity'
import { AssetType } from '../enums/asset-type.enum'
import { TrackableEntity } from '@avara/shared/domain/trackable-entity.interface'
import { SoftDeletableEntity } from '@avara/shared/domain/soft-deletable-entity.interface'
import { validate } from 'class-validator'
import { DomainValidationError } from '@avara/shared/errors/domain-validation.error'
import { ValidationError } from '@nestjs/common'
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDate,
  IsUrl,
} from 'class-validator'

interface AssetProps {
  id?: string
  name: string
  type: AssetType
  mime_type: AssetType
  file_size: number
  source: string
  preview: string
  width?: number
  height?: number
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
  deleted_at?: Date
  deleted_by?: string
}

export class Asset
  extends ChannelListAwareEntity
  implements TrackableEntity, SoftDeletableEntity
{
  @IsString()
  private _name: string

  @IsEnum(AssetType)
  private _type: AssetType

  @IsString()
  private _mime_type: string

  @IsNumber()
  private _file_size: number

  @IsUrl()
  private _source: string

  @IsUrl()
  private _preview: string

  @IsOptional()
  @IsNumber()
  private _width?: number

  @IsOptional()
  @IsNumber()
  private _height?: number

  @IsOptional()
  @IsString()
  private _created_by?: string

  @IsOptional()
  @IsString()
  private _updated_by?: string

  @IsOptional()
  @IsDate()
  private _deleted_at?: Date

  @IsOptional()
  @IsString()
  private _deleted_by?: string

  constructor() {
    super()
  }

  get name(): string {
    return this._name
  }

  get type(): AssetType {
    return this._type
  }

  get mime_type(): string {
    return this._mime_type
  }

  get file_size(): number {
    return this._file_size
  }

  get source(): string {
    return this._source
  }

  get preview(): string {
    return this._preview
  }

  get width(): number | undefined {
    return this._width
  }

  get height(): number | undefined {
    return this._height
  }

  get created_by(): string | undefined {
    return this._created_by
  }

  get updated_by(): string | undefined {
    return this._updated_by
  }

  get deleted_at(): Date | undefined {
    return this._deleted_at
  }

  get deleted_by(): string | undefined {
    return this._deleted_by
  }

  softDelete(deleted_by: string): void {
    this._deleted_at = new Date()
    this._deleted_by = deleted_by
  }

  softRecover(): void {
    this._deleted_at = undefined
    this._deleted_by = undefined
  }

  static async create(props: AssetProps): Promise<Asset> {
    const asset = new Asset()
    asset._name = props.name
    asset._type = props.type
    asset._mime_type = props.mime_type
    asset._file_size = props.file_size
    asset._source = props.source
    asset._preview = props.preview
    asset._width = props.width
    asset._height = props.height
    asset._created_at = props.created_at
    asset._created_by = props.created_by
    asset._updated_at = props.updated_at
    asset._updated_by = props.updated_by
    asset._deleted_at = props.deleted_at
    asset._deleted_by = props.deleted_by

    await asset.validate()

    return asset
  }

  async edit(args: Partial<Omit<AssetProps, 'id'>>): Promise<void> {
    if (args.name !== undefined) this._name = args.name
    if (args.type !== undefined) this._type = args.type
    if (args.mime_type !== undefined) this._mime_type = args.mime_type
    if (args.file_size !== undefined) this._file_size = args.file_size
    if (args.source !== undefined) this._source = args.source
    if (args.preview !== undefined) this._preview = args.preview
    if (args.width !== undefined) this._width = args.width
    if (args.height !== undefined) this._height = args.height
    if (args.updated_by !== undefined) this._updated_by = args.updated_by
    if (args.deleted_at !== undefined) this._deleted_at = args.deleted_at
    if (args.deleted_by !== undefined) this._deleted_by = args.deleted_by

    await this.validate()
  }

  private async validate() {
    const errors: ValidationError[] = await validate(this)
    if (errors.length > 0) {
      throw new DomainValidationError('Asset', errors)
    }
  }
}
