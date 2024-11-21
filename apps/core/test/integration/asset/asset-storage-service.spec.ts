import { Asset } from '@avara/core/domain/asset/domain/entities/asset.entity'
import { AssetType } from '@avara/core/domain/asset/domain/enums/asset-type.enum'
import { ImageProcessor } from '@avara/core/domain/asset/domain/services/image-processor.service'
import { StorageStrategy } from '@avara/core/domain/asset/domain/services/storage-strategy.interface'
import { StorageStrategyFactory } from '@avara/core/domain/asset/infrastructure/factories/storage-strategy.factory'
import { LocalStorageStrategy } from '@avara/core/domain/asset/infrastructure/services/local-storage-strategy.service'
import { DbService } from '@avara/shared/database/db-service'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import * as fs from 'fs/promises'
import * as path from 'path'

describe('LocalStorageStrategy - Integration Tests', () => {
  const TEST_DIRECTORY = path.resolve(__dirname, '__test_assets__')
  let storage: StorageStrategy
  // let configService: ConfigService
  // let imageProcessor: ImageProcessor
  let dbService: DbService

  beforeAll(async () => {
    await fs.mkdir(TEST_DIRECTORY, { recursive: true })
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConfigService,
        StorageStrategyFactory,
        LocalStorageStrategy,
        ImageProcessor,
        DbService,
      ],
    }).compile()

    dbService = module.get<DbService>(DbService)

    const storageFactory = module.get<StorageStrategyFactory>(
      StorageStrategyFactory,
    )

    storage = storageFactory.create('local')

    await fs.rm(TEST_DIRECTORY, { recursive: true, force: true })
    await fs.mkdir(TEST_DIRECTORY, { recursive: true })
    await dbService.asset.deleteMany({})
  })

  afterEach(async () => {
    await fs.rm(TEST_DIRECTORY, { recursive: true, force: true })
    await fs.mkdir(TEST_DIRECTORY, { recursive: true })
    await dbService.asset.deleteMany({})
  })

  afterAll(async () => {
    await fs.rm(TEST_DIRECTORY, { recursive: true, force: true })
    await dbService.asset.deleteMany({})
  })

  it('should save a txt file correctly', async () => {
    const asset = await Asset.create({
      file_size: 0,
      name: 'test-file.txt',
      type: AssetType.DOCUMENT,
      mime_type: 'text/plain',
      original_name: 'test-file.txt',
      source: '',
    })

    const fileContent = Buffer.from('Hello, world!')

    await storage.save(asset, fileContent, { basePath: TEST_DIRECTORY })

    const savedContent = await fs.readFile(asset.source)

    expect(savedContent.toString()).toBe('Hello, world!')
  })

  it.only('should throw error if invalid base path is provided', async () => {
    const asset = await Asset.create({
      file_size: 0,
      name: 'test-file.txt',
      type: AssetType.DOCUMENT,
      mime_type: 'text/plain',
      original_name: 'test-file.txt',
      source: '',
    })

    const fileContent = Buffer.from('Hello, world!')

    await expect(
      storage.save(asset, fileContent, { basePath: '/invalid/path' }),
    ).rejects.toThrow()
  })

  // it('should retrieve a saved file', async () => {
  //   const asset = new Asset({ name: 'test-retrieve.txt', type: 'FILE' })
  //   const fileContent = Buffer.from('Retrieve this content')

  //   await strategy.save(asset, fileContent)

  //   const retrievedContent = await strategy.getAssetBy(asset)

  //   expect(retrievedContent.toString()).toBe('Retrieve this content')
  // })

  // it('should delete an asset and its variations', async () => {
  //   const asset = new Asset({ name: 'test-delete.jpg', type: 'IMAGE' })
  //   const fileContent = Buffer.from('image data')

  //   await strategy.saveImageWithScreenVariations(asset, fileContent)

  //   await strategy.delete(asset)

  //   const allFilesDeleted = await fs
  //     .stat(TEST_DIRECTORY)
  //     .then(() => false)
  //     .catch(() => true) // Directory should be empty or non-existent

  //   expect(allFilesDeleted).toBe(true)
  // })

  // it('should handle missing files gracefully', async () => {
  //   const asset = new Asset({ name: 'missing-file.txt', type: 'FILE' })

  //   await expect(strategy.getAssetBy(asset)).rejects.toThrow()
  //   await expect(strategy.delete(asset)).resolves.not.toThrow()
  // })

  // it('should delete all files in the directory', async () => {
  //   const asset1 = new Asset({ name: 'file1.txt', type: 'FILE' })
  //   const asset2 = new Asset({ name: 'file2.txt', type: 'FILE' })

  //   await strategy.save(asset1, Buffer.from('Content 1'))
  //   await strategy.save(asset2, Buffer.from('Content 2'))

  //   await strategy.deleteAll()

  //   const directoryCleared = await fs
  //     .stat(TEST_DIRECTORY)
  //     .then(() => false)
  //     .catch(() => true)

  //   expect(directoryCleared).toBe(true)
  // })
})
