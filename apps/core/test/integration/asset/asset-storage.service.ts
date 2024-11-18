import { LocalStorageStrategy } from './local-storage-strategy'
import { ConfigService } from '@nestjs/config'
import { ImageProcessor } from '../../domain/services/image-processor.service'
import { Asset } from '../../domain/entities/asset.entity'
import * as fs from 'fs/promises'
import * as path from 'path'

describe('LocalStorageStrategy - Integration Tests', () => {
  const TEST_DIRECTORY = path.resolve(__dirname, '__test_assets__')
  let strategy: LocalStorageStrategy
  let configService: ConfigService
  let imageProcessor: ImageProcessor

  beforeAll(async () => {
    // Ensure the test directory exists
    await fs.mkdir(TEST_DIRECTORY, { recursive: true })
  })

  beforeEach(() => {
    // Mock ConfigService to use the test directory
    configService = new ConfigService()
    jest.spyOn(configService, 'get').mockImplementation((key) => {
      if (key === 'asset.storage.localPath') return TEST_DIRECTORY
      return null
    })

    // Mock ImageProcessor with basic functionality
    imageProcessor = {
      resizeImage: jest.fn(async (file: Buffer, size) =>
        Buffer.from(`resized-${size.width}x${size.height}`),
      ),
    } as unknown as ImageProcessor

    strategy = new LocalStorageStrategy(configService, imageProcessor)
  })

  afterEach(async () => {
    // Clean up the test directory after each test
    await fs.rm(TEST_DIRECTORY, { recursive: true, force: true })
    await fs.mkdir(TEST_DIRECTORY, { recursive: true })
  })

  afterAll(async () => {
    // Remove the test directory after all tests
    await fs.rm(TEST_DIRECTORY, { recursive: true, force: true })
  })

  it('should save a file correctly', async () => {
    const asset = new Asset({ name: 'test-file.txt', type: 'FILE' })
    const fileContent = Buffer.from('Hello, world!')

    await strategy.save(asset, fileContent)

    const savedFilePath = path.join(TEST_DIRECTORY, 'test-file.txt')
    const savedContent = await fs.readFile(savedFilePath)

    expect(savedContent.toString()).toBe('Hello, world!')
    expect(asset.source).toBe(savedFilePath)
  })

  it('should save an image with variations', async () => {
    const asset = new Asset({ name: 'test-image.jpg', type: 'IMAGE' })
    const fileContent = Buffer.from('image data')

    await strategy.saveImageWithScreenVariations(asset, fileContent)

    const originalPath = path.join(TEST_DIRECTORY, 'test-image.jpg')
    const variationPaths = [
      path.join(TEST_DIRECTORY, 'test-image-small.jpg'),
      path.join(TEST_DIRECTORY, 'test-image-medium.jpg'),
      path.join(TEST_DIRECTORY, 'test-image-large.jpg'),
    ]

    const originalExists = await fs.stat(originalPath)
    const variationsExist = await Promise.all(
      variationPaths.map((file) =>
        fs
          .stat(file)
          .then(() => true)
          .catch(() => false),
      ),
    )

    expect(originalExists).toBeTruthy()
    expect(variationsExist.every((exists) => exists)).toBe(true)
  })

  it('should retrieve a saved file', async () => {
    const asset = new Asset({ name: 'test-retrieve.txt', type: 'FILE' })
    const fileContent = Buffer.from('Retrieve this content')

    await strategy.save(asset, fileContent)

    const retrievedContent = await strategy.getAssetBy(asset)

    expect(retrievedContent.toString()).toBe('Retrieve this content')
  })

  it('should delete an asset and its variations', async () => {
    const asset = new Asset({ name: 'test-delete.jpg', type: 'IMAGE' })
    const fileContent = Buffer.from('image data')

    await strategy.saveImageWithScreenVariations(asset, fileContent)

    await strategy.delete(asset)

    const allFilesDeleted = await fs
      .stat(TEST_DIRECTORY)
      .then(() => false)
      .catch(() => true) // Directory should be empty or non-existent

    expect(allFilesDeleted).toBe(true)
  })

  it('should handle missing files gracefully', async () => {
    const asset = new Asset({ name: 'missing-file.txt', type: 'FILE' })

    await expect(strategy.getAssetBy(asset)).rejects.toThrow()
    await expect(strategy.delete(asset)).resolves.not.toThrow()
  })

  it('should delete all files in the directory', async () => {
    const asset1 = new Asset({ name: 'file1.txt', type: 'FILE' })
    const asset2 = new Asset({ name: 'file2.txt', type: 'FILE' })

    await strategy.save(asset1, Buffer.from('Content 1'))
    await strategy.save(asset2, Buffer.from('Content 2'))

    await strategy.deleteAll()

    const directoryCleared = await fs
      .stat(TEST_DIRECTORY)
      .then(() => false)
      .catch(() => true)

    expect(directoryCleared).toBe(true)
  })
})
