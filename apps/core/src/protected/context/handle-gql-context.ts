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

    return {
      req,
      res,
      channel,
      channel_id: channel.id,
      channel_code: channel.code,
      language_code: languageCode ? languageCode : defaultLanguage,
      currency_code: currencyCode ? currencyCode : defaultCurrency,
    }
  }
}
