import { CoreEntity } from '@avara/shared/domain/core-entity.abstract'
import { SoftDeletableEntity } from '@avara/shared/domain/soft-deletable-entity.interface'
import { TrackableEntity } from '@avara/shared/domain/trackable-entity.interface'

interface UpdateDetailsProps {
  code: string
  name: string
  defaultLanguageCode: string
  currencyCode: string
  isDefault: boolean
  updatedBy: string
}

interface ChannelProps {
  id: string | undefined

  code: string
  name: string
  defaultLanguageCode: string
  currencyCode: string
  isDefault: boolean

  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  createdBy?: string
  updatedBy?: string
  deletedBy?: string
}

export class Channel
  extends CoreEntity
  implements TrackableEntity, SoftDeletableEntity
{
  _id: string | undefined

  _code: string
  _name: string
  _defaultLanguageCode: string
  _currencyCode: string
  _isDefault: boolean

  _createdAt: Date | undefined
  _updatedAt: Date | undefined
  _deletedAt: Date | undefined
  _createdBy: string | undefined
  _updatedBy: string | undefined
  _deletedBy: string | undefined

  constructor(channelProps: ChannelProps) {
    super()
    this._id = channelProps.id
    this._code = channelProps.code
    this._name = channelProps.name
    this._defaultLanguageCode = channelProps.defaultLanguageCode
    this._currencyCode = channelProps.currencyCode
    this._isDefault = channelProps.isDefault
    this._createdAt = channelProps.createdAt
    this._updatedAt = channelProps.updatedAt
    this._deletedAt = channelProps.deletedAt
    this._createdBy = channelProps.createdBy
    this._updatedBy = channelProps.updatedBy
    this._deletedBy = channelProps.deletedBy
  }

  static createEmpty(): Channel {
    return new Channel({
      id: undefined,
      code: 'DEFAULT',
      name: 'default',
      defaultLanguageCode: '',
      currencyCode: '',
      isDefault: false,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
      createdBy: undefined,
      updatedBy: undefined,
      deletedBy: undefined,
    })
  }

  get id(): string | undefined {
    return this._id
  }

  get code(): string {
    return this._code
  }

  get name(): string {
    return this._name
  }

  get defaultLanguageCode(): string {
    return this._defaultLanguageCode
  }

  get currencyCode(): string {
    return this._currencyCode
  }

  get isDefault(): boolean {
    return this._isDefault
  }

  get createdAt(): Date | undefined {
    return this._createdAt
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt
  }

  get createdBy(): string | undefined {
    return this._createdBy
  }

  get updatedBy(): string | undefined {
    return this._updatedBy
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

  updateDetails(input: Partial<UpdateDetailsProps>): void {
    if (input.name !== undefined) this._name = input.name

    if (input.code !== undefined) this._code = input.code

    if (input.currencyCode !== undefined)
      this._currencyCode = input.currencyCode

    if (input.defaultLanguageCode !== undefined)
      this._defaultLanguageCode = input.defaultLanguageCode

    if (input.isDefault !== undefined) this._isDefault = input.isDefault

    this._updatedBy = input.updatedBy ? input.updatedBy : 'system'
    this._updatedAt = new Date()
  }
}
