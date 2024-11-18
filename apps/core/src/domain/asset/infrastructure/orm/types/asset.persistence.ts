import { Asset } from '@prisma/client'
import { Channel } from '@prisma/client'

export type AssetPersistence = Asset & { channels?: Channel[] }
