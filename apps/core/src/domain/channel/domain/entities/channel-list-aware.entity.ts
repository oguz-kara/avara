import { Channel } from './channel.entity'
import { ValidateAbleCoreEntity } from '@avara/shared/domain/validateable-core.entity'

export abstract class ChannelListAwareEntity extends ValidateAbleCoreEntity {
  protected _channels?: Channel[]

  get channels(): Channel[] {
    return this._channels
  }

  get channelIds(): string[] {
    return this._channels.map((channel) => channel.id)
  }

  get channelCodes(): string[] {
    return this._channels.map((channel) => channel.code)
  }

  hasChannel(channel: Channel): boolean {
    return this._channels.some((c) => c.id === channel.id)
  }

  addChannel(channel: Channel) {
    if (!this.hasChannel(channel)) this._channels.push(channel)
  }

  removeChannel(channel: Channel) {
    if (this.hasChannel(channel)) {
      this._channels = this._channels.filter((c) => c.id !== channel.id)
      return
    }

    throw new Error('Channel not found')
  }
}
