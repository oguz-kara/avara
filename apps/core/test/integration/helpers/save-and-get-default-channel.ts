import { RequestContext } from '@avara/core/application/context/request-context'
import { Channel } from '@avara/core/domain/channel/domain/entities/channel.entity'
import { DbService } from '@avara/shared/database/db-service'

export const getDefaultChannel = async (dbService: DbService) => {
  const channel = new Channel({
    id: undefined,
    name: 'Default',
    code: 'default',
    currencyCode: 'USD',
    defaultLanguageCode: 'en',
    isDefault: true,
  })

  const isExists = await dbService.channel.findUnique({
    where: {
      code: channel.code,
    },
  })

  if (isExists) {
    return new RequestContext({
      channel,
      channelCode: isExists.code,
      channelId: isExists.id,
      currencyCode: isExists.currencyCode,
      languageCode: isExists.defaultLanguageCode,
    })
  }

  const defaultChannel = await dbService.channel.create({
    data: {
      name: channel.name,
      code: channel.code,
      currencyCode: channel.currencyCode,
      defaultLanguageCode: channel.defaultLanguageCode,
      isDefault: channel.isDefault,
    },
  })

  return new RequestContext({
    channel,
    channelCode: defaultChannel.code,
    channelId: defaultChannel.id,
    currencyCode: defaultChannel.currencyCode,
    languageCode: defaultChannel.defaultLanguageCode,
  })
}
