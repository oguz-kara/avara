import { DbService } from '@avara/shared/database/db-service'

export const createDefaultChannelIfNotExists = async (db: DbService) => {
  const defaultChannel = await db.channel.findFirst({
    where: { code: 'default' },
  })

  if (!defaultChannel) {
    await db.channel.create({
      data: {
        code: 'default',
        name: 'Default Channel',
        currencyCode: 'USD',
        defaultLanguageCode: 'en',
        isDefault: true,
      },
    })
  }
}
