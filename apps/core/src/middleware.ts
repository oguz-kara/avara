import { Request, Response, NextFunction } from 'express'
import { Injectable, NestMiddleware } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { ChannelService } from '@avara/core/domain/channel/application/services/channel.service'

import { RequestContext } from './application/context/request-context'

@Injectable()
export class RestContextMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly channelService: ChannelService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const defaultLanguage = this.configService.get<string>(
      'localization.language.default',
      'en',
    )
    const defaultCurrency = this.configService.get<string>(
      'localization.currency.default',
      'USD',
    )
    const channelId = req.headers['x-channel-id'] as string
    const languageCode = req.headers['x-language-code'] as string
    const currencyCode = req.headers['x-currency-code'] as string

    const channel =
      await this.channelService.getOrCreateDefaultChannel(channelId)

    // @ts-expect-error Property 'context' does not exist on type 'Request'.
    req.context = new RequestContext({
      channel,
      channel_id: channel.id,
      channel_code: channel.code,
      language_code: languageCode ? languageCode : defaultLanguage,
      currency_code: currencyCode ? currencyCode : defaultCurrency,
    })

    next()
  }
}
