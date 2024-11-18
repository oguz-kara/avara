import { StorageStrategyFactory } from './factories/storage-strategy.factory'
import { AssetMapper } from './mappers/asset.mapper'
import { AssetRepository } from './orm/repositories/asset.repository'
import { LocalStorageStrategy } from './services/local-storage-strategy.service'

export const InfraProviders = [
  StorageStrategyFactory,
  LocalStorageStrategy,
  AssetMapper,
  AssetRepository,
]
