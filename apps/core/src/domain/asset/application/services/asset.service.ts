import { Injectable } from '@nestjs/common'
import { FilenameNormalizer } from '../../domain/services/filename-normalizer.service'
import { ImageProcessor } from '../../domain/services/image-processor.service'
import { CoreRepositories } from '@avara/core/application/core-repositories'
import { StorageStrategyFactory } from '../../infrastructure/factories/storage-strategy.factory'
import { FileProcessingContext } from '../../domain/services/file-processing-context'
import { Asset, AssetProps } from '../../domain/entities/asset.entity'
import { RequestContext } from '@avara/core/application/context/request-context'
import { FileTypeService } from '../../domain/services/file-type.service'
import { AssetType } from '../../domain/enums/asset-type.enum'
import { ConfigService } from '@nestjs/config'
import { FileMetadataExtractor } from '../../domain/utils/file-metadat-extractor.util'
import { NoFileUploadedError } from '../../domain/errors/no-file-uploaded-error'
import { FileTooLargeError } from '../../domain/errors/file-too-large-error'
import { PaginationUtils } from '@avara/shared/utils/pagination.util'
import { PaginatedList } from '@avara/core/domain/user/api/types/pagination.type'
import { TransactionContext } from '@avara/shared/database/transaction-context'
import { DbTransactionalClient } from '@avara/shared/database/db-transactional-client'

type FileMetadata = {
  mime_type: string
  file_size: number
  width?: number
  height?: number
}

@Injectable()
export class AssetService {
  private variationsEnabled: boolean
  constructor(
    private readonly filenameNormalizer: FilenameNormalizer,
    private readonly imageProcessor: ImageProcessor,
    private readonly repositories: CoreRepositories,
    private readonly storageFactory: StorageStrategyFactory,
    private readonly fileTypeService: FileTypeService,
    private readonly configService: ConfigService,
    private readonly paginationUtils: PaginationUtils,
    private readonly transactionContext: TransactionContext,
  ) {
    this.variationsEnabled =
      this.configService.get<boolean>('asset.variation.variationsEnabled') ||
      false
  }

  async uploadAsset(
    ctx: RequestContext,
    file: Express.Multer.File,
    parentTx?: DbTransactionalClient,
  ): Promise<AssetProps> {
    if (!file) throw new NoFileUploadedError()

    let fileMetadata: FileMetadata

    const fileType = await this.fileTypeService.getFileTypeFromFile(file)

    const fileBuffer = file.buffer

    const maxFileSize = this.configService.get<number>(
      'asset.storage.maxFileSize',
    )

    if (fileBuffer.length > maxFileSize)
      throw new FileTooLargeError(maxFileSize / 1024 / 1024)

    const assetRepo = this.repositories.get(ctx, 'Asset')

    const storageService = this.storageFactory.create()

    const context = FileProcessingContext.create(fileBuffer, file.originalname)

    context.normalizedFilename = this.filenameNormalizer.normalize(
      context.originalFilename,
      fileType,
    )

    if (fileType === 'IMAGE')
      fileMetadata = await this.imageProcessor.getBufferMetadata(fileBuffer)
    else
      fileMetadata = FileMetadataExtractor.extractMetadata(
        fileBuffer,
        file.originalname,
      )

    context.metadata = {
      ...fileMetadata,
      type: fileType as AssetType,
      source: 'not-added-yet',
    }

    context.asset = await Asset.createFromContext(context, ctx)

    return await this.transactionContext.executeTransaction(async (tx) => {
      await assetRepo.saveResourceToChannel(context.asset, {
        tx: parentTx ? parentTx : tx,
      })

      if (!this.variationsEnabled || fileType !== 'IMAGE')
        await storageService.save(context.asset, fileBuffer)
      else
        await storageService.saveImageWithScreenVariations(
          context.asset,
          fileBuffer,
        )

      const previewUrl =
        this.configService.get<string>('asset.storage.url') +
        '/' +
        context.normalizedFilename

      context.asset.edit({
        preview: previewUrl,
      })

      await assetRepo.saveResourceToChannel(context.asset, {
        tx: parentTx ? parentTx : tx,
      })

      return context.asset.getFields()
    })
  }

  async uploadMultipleAssets(
    ctx: RequestContext,
    files: Express.Multer.File[],
  ): Promise<AssetProps[]> {
    if (!files || files.length === 0) throw new NoFileUploadedError()

    return await this.transactionContext.executeTransaction(async (tx) => {
      return await Promise.all(
        files.map(async (file) => {
          return await this.uploadAsset(ctx, file, tx)
        }),
      )
    })
  }

  async deleteAsset(ctx: RequestContext, assetId: string): Promise<AssetProps> {
    const assetRepo = this.repositories.get(ctx, 'Asset')

    const asset = await assetRepo.findOneInChannel(assetId)

    if (!asset) throw new Error('Asset not found')

    const storageService = this.storageFactory.create()

    await assetRepo.removeResourceInChannel(asset)

    await storageService.delete(asset)

    return asset.getFields()
  }

  async deleteManyAsset(
    ctx: RequestContext,
    assetIdList: string[],
  ): Promise<AssetProps[]> {
    return await Promise.all(
      assetIdList.map(async (assetId) => {
        return await this.deleteAsset(ctx, assetId)
      }),
    )
  }

  async findMany(
    ctx: RequestContext,
    params?: { limit?: number; position?: number },
  ): Promise<PaginatedList<Asset>> {
    if (params.limit && isNaN(Number(params.limit))) {
      throw new Error('Invalid pagination parameters')
    }
    if (params.position && isNaN(Number(params.position))) {
      throw new Error('Invalid pagination parameters')
    }
    const assetRepo = this.repositories.get(ctx, 'Asset')

    const { limit, position } =
      this.paginationUtils.validateAndGetPaginationLimit(params)

    const assetsData = await assetRepo.findManyInChannel({
      limit,
      position,
    })

    return {
      ...assetsData,
      items: assetsData.items.map((asset) => asset.getFields()) as Asset[],
    }
  }

  async findById(ctx: RequestContext, assetId: string): Promise<Asset> {
    const assetRepo = this.repositories.get(ctx, 'Asset')

    const asset = await assetRepo.findOneInChannel(assetId)

    return asset
  }
}
