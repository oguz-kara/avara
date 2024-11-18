import { Asset } from '../entities/asset.entity'

export class FileProcessingContext {
  fileBuffer: Buffer
  originalFilename: string
  normalizedFilename?: string
  metadata?: Partial<Asset>
  asset?: Asset

  constructor(fileBuffer: Buffer, originalFilename: string) {
    this.fileBuffer = fileBuffer
    this.originalFilename = originalFilename
  }

  static create(fileBuffer: Buffer, originalFilename: string) {
    return new FileProcessingContext(fileBuffer, originalFilename)
  }
}
