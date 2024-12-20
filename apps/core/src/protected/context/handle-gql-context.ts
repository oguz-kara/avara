import { RequestContext } from '@avara/core/application/context/request-context'
import { ChannelService } from '@avara/core/domain/channel/application/services/channel.service'
import { ConfigService } from '@nestjs/config'

export const getGqlContextHandler = (
  configService: ConfigService,
  channelService: ChannelService,
) => {
  return async ({ req, res }) => {
    const defaultLanguage = configService.get<string>(
      'localization.language.default',
      'en',
    )
    const defaultCurrency = configService.get<string>(
      'localization.currency.default',
      'USD',
    )
    const channelId = req.headers['x-channel-id']
    const languageCode = req.headers['x-language-code']
    const currencyCode = req.headers['x-currency-code']

    const channel = await channelService.getOrCreateDefaultChannel(channelId)

    const requestContext = new RequestContext({
      channel,
      channelId: channel.id,
      channelCode: channel.code,
      languageCode: languageCode ? languageCode : defaultLanguage,
      currencyCode: currencyCode ? currencyCode : defaultCurrency,
    })

    return {
      req,
      res,
      context: requestContext,
    }
  }
}
