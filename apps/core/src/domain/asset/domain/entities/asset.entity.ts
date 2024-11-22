import { ChannelListAwareEntity } from '@avara/core/domain/channel/domain/entities/channel-list-aware.entity'
import { AssetType } from '../enums/asset-type.enum'
import { TrackableEntity } from '@avara/shared/domain/trackable-entity.interface'
import { SoftDeletableEntity } from '@avara/shared/domain/soft-deletable-entity.interface'
import { IsString, IsEnum, IsNumber, IsOptional, IsDate } from 'class-validator'
import { Channel } from '@avara/core/domain/channel/domain/entities/channel.entity'
import { FileProcessingContext } from '../services/file-processing-context'
import { RequestContext } from '@avara/core/application/context/request-context'
import * as path from 'path'

export interface AssetProps {
  id?: string
  name: string
  originalName: string
  type: AssetType
  mimeType: string
  fileSize: number
  source: string
  preview?: string
  width?: number
  height?: number
  focalPoint?: string
  channels?: Channel[]
  createdAt?: Date
  createdBy?: string
  updatedAt?: Date
  updatedBy?: string
  deletedAt?: Date
  deletedBy?: string
}

export class Asset
  extends ChannelListAwareEntity
  implements TrackableEntity, SoftDeletableEntity
{
  @IsString()
  private _name: string

  @IsString()
  private _originalName: string

  @IsEnum(AssetType)
  private _type: AssetType

  @IsString()
  private _mimeType: string

  @IsNumber()
  private _fileSize: number

  @IsString()
  private _source: string

  @IsString()
  @IsOptional()
  private _preview: string

  @IsString()
  @IsOptional()
  private _storageProvider?: string

  @IsOptional()
  @IsNumber()
  private _width?: number

  @IsOptional()
  @IsNumber()
  private _height?: number

  @IsOptional()
  @IsString()
  private _focalPoint?: string

  @IsOptional()
  @IsString()
  private _createdBy?: string

  @IsOptional()
  @IsString()
  private _updatedBy?: string

  @IsOptional()
  @IsDate()
  private _deletedAt?: Date

  @IsOptional()
  @IsString()
  private _deletedBy?: string

  constructor() {
    super()
  }

  get name(): string {
    return this._name
  }

  get storageProvider(): string {
    return this._storageProvider
  }

  get originalName(): string {
    return this._originalName
  }

  get type(): AssetType {
    return this._type
  }

  get mimeType(): string {
    return this._mimeType
  }

  get fileSize(): number {
    return this._fileSize
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

  get focalPoint(): string | undefined {
    return this._focalPoint
  }

  get createdBy(): string | undefined {
    return this._createdBy
  }

  get updatedBy(): string | undefined {
    return this._updatedBy
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt
  }

  get deletedBy(): string | undefined {
    return this._deletedBy
  }

  softDelete(deletedBy: string): void {
    this._deletedAt = new Date()
    this._deletedBy = deletedBy
  }

  recover(): void {
    this._deletedAt = undefined
    this._deletedBy = undefined
  }

  static async create(props: AssetProps): Promise<Asset> {
    const asset = new Asset()
    asset._id = props.id
    asset._name = props.name
    asset._originalName = props.originalName
    asset._type = props.type
    asset._mimeType = props.mimeType
    asset._fileSize = props.fileSize
    asset._source = props.source
    asset._preview = props.preview
    asset._width = props.width
    asset._height = props.height
    asset._channels = props.channels
    asset._createdAt = props.createdAt
    asset._createdBy = props.createdBy
    asset._updatedAt = props.updatedAt
    asset._updatedBy = props.updatedBy
    asset._deletedAt = props.deletedAt
    asset._deletedBy = props.deletedBy

    await asset.validate('Asset')

    return asset
  }

  static async createFromContext(
    context: FileProcessingContext,
    ctx: RequestContext,
  ) {
    const { originalFilename, normalizedFilename, metadata } = context

    const asset = new Asset()
    asset._name = normalizedFilename
    asset._originalName = path.basename(
      originalFilename,
      path.extname(originalFilename),
    )
    asset._mimeType = metadata.mimeType || ''
    asset._fileSize = metadata.fileSize || 0
    asset._width = metadata.width || 0
    asset._height = metadata.height || 0
    asset._type = metadata.type
    asset._source = metadata.source
    asset._channels = [ctx.channel]

    await asset.validate('Asset')

    return asset
  }

  async edit(args: Partial<Omit<AssetProps, 'id'>>): Promise<void> {
    if (args.name !== undefined) this._name = args.name
    if (args.originalName !== undefined) this._name = args.originalName
    if (args.type !== undefined) this._type = args.type
    if (args.mimeType !== undefined) this._mimeType = args.mimeType
    if (args.fileSize !== undefined) this._fileSize = args.fileSize
    if (args.source !== undefined) this._source = args.source
    if (args.preview !== undefined) this._preview = args.preview
    if (args.width !== undefined) this._width = args.width
    if (args.height !== undefined) this._height = args.height
    if (args.updatedBy !== undefined) this._updatedBy = args.updatedBy
    if (args.deletedAt !== undefined) this._deletedAt = args.deletedAt
    if (args.deletedBy !== undefined) this._deletedBy = args.deletedBy

    await this.validate('Asset')
  }

  getFields(): AssetProps {
    const dt = {
      id: this.id,
      fileSize: this._fileSize,
      originalName: this._originalName,
      height: this._height,
      mimeType: this._mimeType,
      name: this._name,
      preview: this._preview,
      source: this._source,
      type: this._type,
      width: this._width,
      createdAt: this._createdAt,
      createdBy: this._createdBy,
      updatedAt: this._updatedAt,
      updatedBy: this._updatedBy,
      deletedAt: this._deletedAt,
      deletedBy: this._deletedBy,
    }

    return dt
  }
}
