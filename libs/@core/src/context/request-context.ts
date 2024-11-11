import { Channel } from '@avara/shared/modules/channel/domain/entities/channel.entity'
import { ID } from '../../../@shared/src/types/id.type'

interface RequestContextProps {
  channel: Channel
  channel_id: ID
  channel_code: string
  language_code: string
  currency_code: string
}

export class RequestContext {
  private readonly _channel_id: ID
  private readonly _channel_code: string
  private readonly _channel: Channel
  private readonly _language_code: string
  private readonly _currency_code: string

  constructor({
    channel_code,
    channel_id,
    channel,
    language_code,
    currency_code,
  }: RequestContextProps) {
    this._channel_code = channel_code
    this._channel_id = channel_id
    this._channel = channel
    this._language_code = language_code
    this._currency_code = currency_code
  }

  get channel_id(): ID {
    return this._channel_id
  }

  get channel_code(): string {
    return this._channel_code
  }

  get channel(): Channel {
    return this._channel
  }

  get language_code(): string {
    return this._language_code
  }

  get currency_code(): string {
    return this._currency_code
  }
}
