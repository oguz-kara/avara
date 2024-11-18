import { StorageStrategy } from '../../domain/services/storage-strategy.interface'
import * as fs from 'fs/promises'
import * as path from 'path'
import { Asset } from '../../domain/entities/asset.entity'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ImageProcessor } from '../../domain/services/image-processor.service'
import { defaultScreenSizes } from '@avara/core/config/default-screen-sizes.config'
import { UnsupportedFileError } from '../../domain/errors/unsupported-file-error'
import { DefaultScreenSizeItem } from '../../domain/types/default-screen-size-item.type'

@Injectable()
export class LocalStorageStrategy implements StorageStrategy {
  private basePath: string
  private localPath: string
  private variationSizes: Record<string, DefaultScreenSizeItem>

  constructor(
    private readonly configService: ConfigService,
    private readonly imageProcessor: ImageProcessor,
  ) {
    this.basePath = path.resolve(__dirname, 'assets', 'preview')
    this.localPath =
      this.configService.get<string>('asset.storage.localPath') || ''
    this.variationSizes = {
      ...defaultScreenSizes,
      ...this.configService.get<Record<string, DefaultScreenSizeItem>>(
        'asset.variation.sizes',
        {},
      ),
    }
  }

  private async ensureDirectoryExists(directory: string): Promise<void> {
    try {
      await fs.mkdir(directory, { recursive: true })
    } catch (error) {
      if (error.code !== 'EEXIST') throw error
    }
  }

  private buildAssetPath(assetName: string, variantKey?: string): string {
    const ext = path.extname(assetName)
    const basename = path.basename(assetName, ext)
    return variantKey
      ? path.join(this.basePath, `${basename}-${variantKey}${ext}`)
      : path.join(this.basePath, assetName)
  }

  private async cleanUpFiles(files: string[]): Promise<void> {
    for (const filePath of files) {
      try {
        await fs.unlink(filePath)
      } catch (error) {
        console.error(`Failed to delete file: ${filePath}`, error)
      }
    }
  }

  private setSourcePath(asset: Asset): void {
    asset.edit({ source: path.join(__dirname, this.localPath, asset.name) })
  }

  async save(asset: Asset, file: Buffer): Promise<void> {
    await this.ensureDirectoryExists(this.basePath)
    const filePath = this.buildAssetPath(asset.name)
    await fs.writeFile(filePath, file)
    this.setSourcePath(asset)
  }

  async saveImageWithScreenVariations(
    asset: Asset,
    file: Buffer,
  ): Promise<void> {
    if (asset.type !== 'IMAGE')
      throw new UnsupportedFileError(
        'Only images are supported for this operation!',
      )
    await this.ensureDirectoryExists(this.basePath)

    const createdFiles: string[] = []
    try {
      const originalPath = this.buildAssetPath(asset.name)
      await fs.writeFile(originalPath, file)
      createdFiles.push(originalPath)

      for (const [key, size] of Object.entries(this.variationSizes)) {
        const resizedBuffer = await this.imageProcessor.resizeImage(file, size)
        const variationPath = this.buildAssetPath(asset.name, key)
        await fs.writeFile(variationPath, resizedBuffer)
        createdFiles.push(variationPath)
      }

      this.setSourcePath(asset)
    } catch (error) {
      await this.cleanUpFiles(createdFiles)
      throw error
    }
  }

  async getAssetBy(asset: Asset): Promise<Buffer> {
    try {
      return await fs.readFile(asset.source)
    } catch (error) {
      console.error(`Error reading file: ${asset.source}`, error)
      throw error
    }
  }

  async delete(asset: Asset): Promise<void> {
    const basename = path.basename(asset.source)
    const basenameWithoutExt = path.basename(
      asset.source,
      path.extname(asset.source),
    )

    const filesToDelete = Object.keys(this.variationSizes).map((key) =>
      asset.source.replace(
        basename,
        `${basenameWithoutExt}-${key}${path.extname(asset.source)}`,
      ),
    )
    filesToDelete.push(asset.source)

    for (const filePath of filesToDelete) {
      try {
        await fs.access(filePath)
        await fs.unlink(filePath)
      } catch (error) {
        if (error.code === 'ENOENT') {
          console.warn(`File not found, skipping deletion: ${filePath}`)
        } else {
          console.error(`Error deleting file: ${filePath}`, error)
          throw error
        }
      }
    }
  }
}
