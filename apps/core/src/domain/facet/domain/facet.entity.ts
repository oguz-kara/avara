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
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  updatedBy?: string
  createdBy?: string
  deletedBy?: string
}

export class Facet
  extends ChannelListAwareEntity
  implements TrackableEntity, SoftDeletableEntity
{
  @IsString()
  @MaxLength(60)
  @MinLength(2)
  private Name: string

  @IsString()
  @MaxLength(60)
  @MinLength(2)
  private Code: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FacetValue)
  protected FacetValues: FacetValue[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Channel)
  protected Channels: Channel[]

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @MinLength(1)
  private CreatedBy: string

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @MinLength(1)
  private UpdatedBy: string

  @IsOptional()
  @IsDate()
  private DeletedAt: Date

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @MinLength(1)
  private DeletedBy: string

  private constructor(props: FacetProps) {
    super()
    this._id = props.id
    this.Name = props.name
    this.Code = props.code
    this.FacetValues = props.values ?? []
    this.Channels = props.channels ?? []
    this.CreatedBy = props.createdBy
    this.UpdatedBy = props.updatedBy
    this.DeletedBy = props.deletedBy
    this.DeletedAt = props.deletedAt
    this._createdAt = props.createdAt ?? new Date()
    this._updatedAt = props.updatedAt
  }

  static create(args: FacetProps): Facet {
    const facet = new Facet(args)
    facet.validateSync('Facet')
    return facet
  }

  updateDetails(name: string, code: string): void {
    this.Name = name
    this.Code = code
    this._updatedAt = new Date()
    this.validateSync('Facet')
  }

  addValue(value: FacetValue): void {
    this.FacetValues.push(value)
  }

  addValueList(values: FacetValue[]): void {
    this.FacetValues.push(...values)
  }

  removeValue(value: FacetValue): void {
    this.FacetValues = this.FacetValues.filter((v) => v !== value)
  }

  get name(): string {
    return this.Name
  }

  get code(): string {
    return this.Code
  }

  get facetValues(): FacetValue[] {
    return this.FacetValues
  }

  get channels(): Channel[] {
    return this.Channels
  }

  get createdBy(): string {
    return this.CreatedBy
  }

  get updatedBy(): string {
    return this.UpdatedBy
  }

  get deletedAt(): Date {
    return this.DeletedAt
  }

  get deletedBy(): string {
    return this.DeletedBy
  }

  softDelete(deletedBy: string): void {
    this.DeletedAt = new Date()
    this.DeletedBy = deletedBy
  }

  recover(): void {
    this.DeletedAt = undefined
    this.DeletedBy = undefined
  }
}
