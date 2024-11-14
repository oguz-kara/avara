import { Channel } from './channel.entity'

export abstract class ChannelAwareEntity {
  protected _channel: Channel

  get channel(): Channel {
    return this._channel
  }

  set channel(channel: Channel) {
    this._channel = channel
  }
}
