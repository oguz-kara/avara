import { Channel } from '@avara/core/domain/channel/domain/entities/channel.entity'
import { ID } from '@avara/shared/types/id.type'

interface RequestContextProps {
  channel: Channel
  channelId: ID
  channelCode: string
  languageCode: string
  currencyCode: string
}

export class RequestContext {
  private readonly _channelId: ID
  private readonly _channelCode: string
  private readonly _channel: Channel
  private readonly _languageCode: string
  private readonly _currencyCode: string

  constructor({
    channelCode,
    channelId,
    channel,
    languageCode,
    currencyCode,
  }: RequestContextProps) {
    this._channelCode = channelCode
    this._channelId = channelId
    this._channel = channel
    this._languageCode = languageCode
    this._currencyCode = currencyCode
  }

  get channelId(): ID {
    return this._channelId
  }

  get channelCode(): string {
    return this._channelCode
  }

  get channel(): Channel {
    return this._channel
  }

  get languageCode(): string {
    return this._languageCode
  }

  get currencyCode(): string {
    return this._currencyCode
  }
}
