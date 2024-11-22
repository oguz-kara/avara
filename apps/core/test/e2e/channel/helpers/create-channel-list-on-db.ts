import { DbService } from '@avara/shared/database/db-service'

const channelList = [
  {
    name: 'Global Channel',
    code: 'GLOBAL',
    currencyCode: 'USD',
    defaultLanguageCode: 'EN',
    isDefault: true,
  },
  {
    name: 'Europe Channel',
    code: 'EUROPE',
    currencyCode: 'EUR',
    defaultLanguageCode: 'EN',
    isDefault: false,
  },
  {
    name: 'Asia Channel',
    code: 'ASIA',
    currencyCode: 'JPY',
    defaultLanguageCode: 'JA',
    isDefault: false,
  },
  {
    name: 'Africa Channel',
    code: 'AFRICA',
    currencyCode: 'ZAR',
    defaultLanguageCode: 'EN',
    isDefault: false,
  },
  {
    name: 'South America Channel',
    code: 'SOUTHaMERICA',
    currencyCode: 'BRL',
    defaultLanguageCode: 'PT',
    isDefault: false,
  },
  {
    name: 'Australia Channel',
    code: 'AUSTRALIA',
    currencyCode: 'AUD',
    defaultLanguageCode: 'EN',
    isDefault: false,
  },
]

export const createChannelListOnDb = async (dbService: DbService) => {
  await dbService.channel.createMany({
    data: channelList,
  })
}
