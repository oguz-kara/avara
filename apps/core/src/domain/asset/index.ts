import { MulterModule } from '@nestjs/platform-express'
import { Services } from './application'
import { DomainServices } from './domain'
import { InfraProviders } from './infrastructure'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as multer from 'multer'
import { AssetController } from './api/rest/controllers/asset.controller'

export const AssetProviders = [
  ...DomainServices,
  ...Services,
  ...InfraProviders,
]

export const AssetControllers = [AssetController]

export const AssetImports = [
  MulterModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async () => ({
      storage: multer.memoryStorage(),
    }),
    inject: [ConfigService],
  }),
]
