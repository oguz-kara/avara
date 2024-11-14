import { ConfigService } from '@nestjs/config'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { RequestContext } from './application/context/request-context'
import { ChannelService } from './domain/channel/application/services/channel.service'
import { Channel } from './domain/channel/domain/entities/channel.entity'

type CustomRequest = Request & { context: RequestContext }

@Injectable()
export class ContextMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly channelService: ChannelService,
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const defaultLanguage = this.configService.get<string>(
      'localization.language.default',
      'en',
    )
    const defaultCurrency = this.configService.get<string>(
      'localization.currency.default',
      'USD',
    )

    const channelId = req.headers['x-channel-id']
    const channelCode = req.headers['x-channel-code']
    const languageCode = req.headers['x-language-code']
    const currencyCode = req.headers['x-currency-code']
    const channel = await this.getChannel(channelId)

    req.context = new RequestContext({
      channel: channel,
      channel_code: channelCode as string,
      channel_id: channelId as string,
      language_code: (languageCode || defaultLanguage) as string,
      currency_code: (currencyCode || defaultCurrency) as string,
    })

    next()
  }

  private async getChannel(channelId: string | string[] | undefined) {
    let channel: Channel | undefined = undefined

    if (channelId) {
      channel = await this.channelService.getChannelById(channelId as string)
      channel = channel
        ? channel
        : await this.channelService.getOrCreateDefaultChannel()
    } else channel = await this.channelService.getOrCreateDefaultChannel()

    return channel
  }
}
