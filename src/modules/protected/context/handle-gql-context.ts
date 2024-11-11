import { ChannelService } from '@avara/shared/modules/channel/application/services/channel.service'
import { Channel } from '@avara/shared/modules/channel/domain/entities/channel.entity'
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
    const channelCode = req.headers['x-channel-code']
    const languageCode = req.headers['x-language-code']
    const currencyCode = req.headers['x-currency-code']
    let channel: Channel | undefined = undefined

    if (channelId) {
      channel = await channelService.getChannelById(channelId)
      channel = channel
        ? channel
        : await channelService.getOrCreateDefaultChannel()
    } else channel = await channelService.getOrCreateDefaultChannel()

    return {
      req,
      res,
      channel,
      channel_id: channelId ? channelId : channel?.id,
      channel_code: channelCode ? channelCode : channel?.code,
      language_code: languageCode ? languageCode : defaultLanguage,
      currency_code: currencyCode ? currencyCode : defaultCurrency,
    }
  }
}
