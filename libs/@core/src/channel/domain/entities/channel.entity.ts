import { CoreEntity } from '@avara/shared/domain/core-entity.abstract'
import { SoftDeletableEntity } from '@avara/shared/domain/soft-deletable-entity.interface'
import { TrackableEntity } from '@avara/shared/domain/trackable-entity.interface'

interface UpdateDetailsProps {
  code: string
  name: string
  default_language_code: string
  currency_code: string
  is_default: boolean
  updated_by: string
}

interface ChannelProps {
  id: string | undefined

  code: string
  name: string
  default_language_code: string
  currency_code: string
  is_default: boolean

  created_at?: Date
  updated_at?: Date
  deleted_at?: Date
  created_by?: string
  updated_by?: string
  deleted_by?: string
}

export class Channel
  extends CoreEntity
  implements TrackableEntity, SoftDeletableEntity
{
  _id: string | undefined

  _code: string
  _name: string
  _default_language_code: string
  _currency_code: string
  _is_default: boolean

  _created_at: Date | undefined
  _updated_at: Date | undefined
  _deleted_at: Date | undefined
  _created_by: string | undefined
  _updated_by: string | undefined
  _deleted_by: string | undefined

  constructor(channelProps: ChannelProps) {
    super()
    this._id = channelProps.id
    this._code = channelProps.code
    this._name = channelProps.name
    this._default_language_code = channelProps.default_language_code
    this._currency_code = channelProps.currency_code
    this._is_default = channelProps.is_default
    this._created_at = channelProps.created_at
    this._updated_at = channelProps.updated_at
    this._deleted_at = channelProps.deleted_at
    this._created_by = channelProps.created_by
    this._updated_by = channelProps.updated_by
    this._deleted_by = channelProps.deleted_by
  }

  static createEmpty(): Channel {
    return new Channel({
      id: undefined,
      code: 'DEFAULT',
      name: 'default',
      default_language_code: '',
      currency_code: '',
      is_default: false,
      created_at: undefined,
      updated_at: undefined,
      deleted_at: undefined,
      created_by: undefined,
      updated_by: undefined,
      deleted_by: undefined,
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

  get default_language_code(): string {
    return this._default_language_code
  }

  get currency_code(): string {
    return this._currency_code
  }

  get is_default(): boolean {
    return this._is_default
  }

  get created_at(): Date | undefined {
    return this._created_at
  }

  get updated_at(): Date | undefined {
    return this._updated_at
  }

  get deleted_at(): Date | undefined {
    return this._deleted_at
  }

  get created_by(): string | undefined {
    return this._created_by
  }

  get updated_by(): string | undefined {
    return this._updated_by
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

  updateDetails(input: Partial<UpdateDetailsProps>): void {
    if (input.name !== undefined) this._name = input.name

    if (input.code !== undefined) this._code = input.code

    if (input.currency_code !== undefined)
      this._currency_code = input.currency_code

    if (input.default_language_code !== undefined)
      this._default_language_code = input.default_language_code

    if (input.is_default !== undefined) this._is_default = input.is_default

    this._updated_by = input.updated_by ? input.updated_by : 'system'
    this._updated_at = new Date()
  }
}
