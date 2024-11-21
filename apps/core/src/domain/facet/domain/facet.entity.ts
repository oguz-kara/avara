import { SoftDeletableEntity } from '@avara/shared/domain/soft-deletable-entity.interface'
import { ChannelListAwareEntity } from '../../channel/domain/entities/channel-list-aware.entity'
import { FacetValue } from './facet-value.entity'
import { TrackableEntity } from '@avara/shared/domain/trackable-entity.interface'
import {
  IsArray,
  IsDate,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator'
import { Channel } from '../../channel/domain/entities/channel.entity'
import { Type } from 'class-transformer'

export interface FacetProps {
  id?: string
  name: string
  code: string
  values?: FacetValue[]
  channels?: Channel[]
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date
  updated_by?: string
  created_by?: string
  deleted_by?: string
}

export class Facet
  extends ChannelListAwareEntity
  implements TrackableEntity, SoftDeletableEntity
{
  @IsString()
  @MaxLength(60)
  @MinLength(2)
  private _name: string

  @IsString()
  @MaxLength(60)
  @MinLength(2)
  private _code: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FacetValue)
  protected _facet_values: FacetValue[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Channel)
  protected _channels: Channel[]

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @MinLength(1)
  private _created_by: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @MinLength(1)
  private _updated_by: string

  @IsOptional()
  @IsDate()
  private _deleted_at: Date

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @MinLength(1)
  private _deleted_by: string

  private constructor(props: FacetProps) {
    super()
    this._id = props.id
    this._name = props.name
    this._code = props.code
    this._facet_values = props.values ?? []
    this._channels = props.channels ?? []
    this._created_by = props.created_by
    this._updated_by = props.updated_by
    this._deleted_by = props.deleted_by
    this._deleted_at = props.deleted_at
    this._created_at = props.created_at ?? new Date()
    this._updated_at = props.updated_at
  }

  static create(args: FacetProps): Facet {
    const facet = new Facet(args)
    facet.validateSync('Facet')
    return facet
  }

  updateDetails(name: string, code: string): void {
    this._name = name
    this._code = code
    this._updated_at = new Date()
    this.validateSync('Facet')
  }

  addValue(value: FacetValue): void {
    this._facet_values.push(value)
  }

  addValueList(values: FacetValue[]): void {
    this._facet_values.push(...values)
  }

  removeValue(value: FacetValue): void {
    this._facet_values = this._facet_values.filter((v) => v !== value)
  }

  get name(): string {
    return this._name
  }

  get code(): string {
    return this._code
  }

  get facet_values(): FacetValue[] {
    return this._facet_values
  }

  get channels(): Channel[] {
    return this._channels
  }

  get created_by(): string {
    return this._created_by
  }

  get updated_by(): string {
    return this._updated_by
  }

  get deleted_at(): Date {
    return this._deleted_at
  }

  get deleted_by(): string {
    return this._deleted_by
  }

  softDelete(deleted_by: string): void {
    this._deleted_at = new Date()
    this._deleted_by = deleted_by
  }

  recover(): void {
    this._deleted_at = undefined
    this._deleted_by = undefined
  }
}
