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
        currency_code: 'USD',
        default_language_code: 'en',
        is_default: true,
      },
    })
  }
}
