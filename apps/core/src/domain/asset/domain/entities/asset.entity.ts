import { ChannelListAwareEntity } from '@avara/core/domain/channel/domain/entities/channel-list-aware.entity'
import { AssetType } from '../enums/asset-type.enum'
import { TrackableEntity } from '@avara/shared/domain/trackable-entity.interface'
import { SoftDeletableEntity } from '@avara/shared/domain/soft-deletable-entity.interface'
import { validate } from 'class-validator'
import { DomainValidationError } from '@avara/shared/errors/domain-validation.error'
import { ValidationError } from '@nestjs/common'
import { IsString, IsEnum, IsNumber, IsOptional, IsDate } from 'class-validator'
import { Channel } from '@avara/core/domain/channel/domain/entities/channel.entity'
import { FileProcessingContext } from '../services/file-processing-context'
import { RequestContext } from '@avara/core/application/context/request-context'
import * as path from 'path'

export interface AssetProps {
  id?: string
  name: string
  original_name: string
  type: AssetType
  mime_type: string
  file_size: number
  source: string
  preview?: string
  width?: number
  height?: number
  focal_point?: string
  channels?: Channel[]
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

  @IsString()
  private _original_name: string

  @IsEnum(AssetType)
  private _type: AssetType

  @IsString()
  private _mime_type: string

  @IsNumber()
  private _file_size: number

  @IsString()
  private _source: string

  @IsString()
  @IsOptional()
  private _preview: string

  @IsOptional()
  @IsNumber()
  private _width?: number

  @IsOptional()
  @IsNumber()
  private _height?: number

  @IsOptional()
  @IsString()
  private _focal_point?: string

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

  get original_name(): string {
    return this._original_name
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

  get focal_point(): string | undefined {
    return this._focal_point
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
    asset._id = props.id
    asset._name = props.name
    asset._original_name = props.original_name
    asset._type = props.type
    asset._mime_type = props.mime_type
    asset._file_size = props.file_size
    asset._source = props.source
    asset._preview = props.preview
    asset._width = props.width
    asset._height = props.height
    asset._channels = props.channels
    asset._created_at = props.created_at
    asset._created_by = props.created_by
    asset._updated_at = props.updated_at
    asset._updated_by = props.updated_by
    asset._deleted_at = props.deleted_at
    asset._deleted_by = props.deleted_by

    await asset.validate()

    return asset
  }

  static async createFromContext(
    context: FileProcessingContext,
    ctx: RequestContext,
  ) {
    const { originalFilename, normalizedFilename, metadata } = context

    const asset = new Asset()
    asset._name = normalizedFilename
    asset._original_name = path.basename(
      originalFilename,
      path.extname(originalFilename),
    )
    asset._mime_type = metadata.mime_type || ''
    asset._file_size = metadata.file_size || 0
    asset._width = metadata.width || 0
    asset._height = metadata.height || 0
    asset._type = metadata.type
    asset._source = metadata.source
    asset._channels = [ctx.channel]

    await asset.validate()

    return asset
  }

  async edit(args: Partial<Omit<AssetProps, 'id'>>): Promise<void> {
    if (args.name !== undefined) this._name = args.name
    if (args.original_name !== undefined) this._name = args.original_name
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

  getFields(): AssetProps {
    const dt = {
      id: this._id,
      file_size: this._file_size,
      original_name: this._original_name,
      height: this._height,
      mime_type: this._mime_type,
      name: this._name,
      preview: this._preview,
      source: this._source,
      type: this._type,
      width: this._width,
      created_at: this._created_at,
      created_by: this._created_by,
      updated_at: this._updated_at,
      updated_by: this._updated_by,
      deleted_at: this._deleted_at,
      deleted_by: this._deleted_by,
    }

    console.log({ dt })

    return dt
  }

  private async validate() {
    const errors: ValidationError[] = await validate(this)
    if (errors.length > 0) {
      throw new DomainValidationError('Asset', errors)
    }
  }
}
