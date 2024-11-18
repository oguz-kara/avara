import { Asset } from '../entities/asset.entity'

export interface StorageStrategy {
  save(asset: Asset, file: Buffer): Promise<void>
  saveImageWithScreenVariations(asset: Asset, file: Buffer): Promise<void>
  getAssetBy(asset: Asset): Promise<Buffer>
  delete(asset: Asset): Promise<void>
  deleteAll(): Promise<void>
}
