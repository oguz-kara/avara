import { Test, TestingModule } from '@nestjs/testing'
import { PaginationUtils } from '@avara/shared/utils/pagination.util'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { CategoryService } from '@avara/core/domain/category/application/services/category.service'
import { CategoryRepository } from '@avara/core/domain/category/infrastructure/repositories/category.repository'
import { CreateCategoryDto } from '@avara/core/domain/category/api/graphql/dto/create-category.dto'
import { CategoryType } from '@avara/core/domain/category/application/enums/category.enum'
import { DbService } from '@avara/shared/database/db-service'
import { CategoryMapper } from '@avara/core/domain/category/infrastructure/mappers/category.mapper'
import { ConfigService } from '@nestjs/config'
import { DBTransactionService } from '@avara/shared/database/db-transaction'
import { Channel } from '@avara/core/domain/channel/domain/entities/channel.entity'
import { ChannelRepository } from '@avara/core/domain/channel/infrastructure/repositories/channel.repository'
import { RequestContext } from '@avara/core/application/context/request-context'

describe('CategoryService (Integration)', () => {
  let service: CategoryService
  let db: DbService
  let repo: CategoryRepository
  let channelRepository: ChannelRepository
  let ctx: RequestContext

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        CategoryRepository,
        PaginationUtils,
        DbService,
        CategoryMapper,
        PaginationUtils,
        ConfigService,
        DBTransactionService,
        ChannelRepository,
      ],
    }).compile()

    service = module.get<CategoryService>(CategoryService)
    db = module.get<DbService>(DbService)
    repo = module.get<CategoryRepository>(CategoryRepository)
    channelRepository = module.get<ChannelRepository>(ChannelRepository)

    const channel = new Channel({
      id: undefined,
      name: 'Default',
      code: 'default',
      currencyCode: 'USD',
      defaultLanguageCode: 'en',
      isDefault: true,
    })

    await channelRepository.save(channel)

    ctx = new RequestContext({
      channel,
      channelCode: channel.code,
      channelId: channel.id,
      currencyCode: channel.currencyCode,
      languageCode: channel.defaultLanguageCode,
    })
  })

  beforeEach(async () => {
    await db.$transaction([db.category.deleteMany()])
  })

  afterAll(async () => {
    await db.$transaction([db.category.deleteMany()])
  })

  describe('createProductCategory', () => {
    it('should create a new product category successfully', async () => {
      const input: CreateCategoryDto = {
        name: 'Electronics',
        categoryType: CategoryType.PRODUCT,
        parentCategoryId: null,
        content: '<p>Content</p>',
        contentType: 'MD',
      }

      const result = await service.createCategory(ctx, input)
      expect(result).toBeDefined()
      expect(result.name).toBe('Electronics')

      const categoryFromDb = await repo.findByNameAndType(
        result.name,
        result.categoryType,
      )
      expect(categoryFromDb).toBeDefined()
      expect(categoryFromDb?.name).toBe('Electronics')
    })

    it('should throw a ConflictException if category already exists', async () => {
      const input: CreateCategoryDto = {
        name: 'Electronics',
        categoryType: CategoryType.PRODUCT,
        parentCategoryId: null,
        content: '<p>Content</p>',
        contentType: 'MD',
      }

      await db.category.create({
        data: {
          name: input.name,
          categoryType: input.categoryType,
          parentCategoryId: input.parentCategoryId,
          content: input.content,
          contentType: 'MD',
        },
      })

      await expect(service.createCategory(ctx, input)).rejects.toThrow(
        ConflictException,
      )
    })
  })

  describe('findById', () => {
    it('should return a product category if it exists', async () => {
      const category = await db.category.create({
        data: {
          name: 'Electronics',
          categoryType: CategoryType.PRODUCT,
          parentCategoryId: null,
          content: '<p>Content</p>',
          contentType: 'MD',
        },
      })

      const result = await service.findById(ctx, category.id)
      expect(result).toBeDefined()
      expect(result?.name).toBe('Electronics')
    })

    it('should return null if category does not exist', async () => {
      const result = await service.findById(ctx, 'non-existing-id')
      expect(result).toBeNull()
    })
  })

  describe('removeProductCategoryById', () => {
    it('should remove the product category if it exists', async () => {
      const category = await db.category.create({
        data: {
          name: 'Electronics',
          categoryType: CategoryType.PRODUCT,
          parentCategoryId: null,
          content: '<p>Content</p>',
          contentType: 'MD',
        },
      })

      await service.removeProductCategoryById(ctx, category.id)

      const categoryFromDb = await db.category.findUnique({
        where: { id: category.id },
      })
      expect(categoryFromDb).toBeNull()
    })

    it('should throw NotFoundException if category does not exist', async () => {
      await expect(
        service.removeProductCategoryById(ctx, 'non-existing-id'),
      ).rejects.toThrow(NotFoundException)
    })
  })
})
