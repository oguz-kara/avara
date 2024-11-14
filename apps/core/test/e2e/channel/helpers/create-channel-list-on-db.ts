import { DbService } from '@avara/shared/database/db-service'

const channelList = [
  {
    name: 'Global Channel',
    code: 'GLOBAL',
    currency_code: 'USD',
    default_language_code: 'EN',
    is_default: true,
  },
  {
    name: 'Europe Channel',
    code: 'EUROPE',
    currency_code: 'EUR',
    default_language_code: 'EN',
    is_default: false,
  },
  {
    name: 'Asia Channel',
    code: 'ASIA',
    currency_code: 'JPY',
    default_language_code: 'JA',
    is_default: false,
  },
  {
    name: 'Africa Channel',
    code: 'AFRICA',
    currency_code: 'ZAR',
    default_language_code: 'EN',
    is_default: false,
  },
  {
    name: 'South America Channel',
    code: 'SOUTH_AMERICA',
    currency_code: 'BRL',
    default_language_code: 'PT',
    is_default: false,
  },
  {
    name: 'Australia Channel',
    code: 'AUSTRALIA',
    currency_code: 'AUD',
    default_language_code: 'EN',
    is_default: false,
  },
]

export const createChannelListOnDb = async (dbService: DbService) => {
  await dbService.channel.createMany({
    data: channelList,
  })
}
