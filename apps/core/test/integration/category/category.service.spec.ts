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
      currency_code: 'USD',
      default_language_code: 'en',
      is_default: true,
    })

    await channelRepository.save(channel)

    ctx = new RequestContext({
      channel,
      channel_code: channel.code,
      channel_id: channel.id,
      currency_code: channel.currency_code,
      language_code: channel.default_language_code,
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
        category_type: CategoryType.PRODUCT,
        parent_category_id: null,
        content: '<p>Content</p>',
        content_type: 'MD',
      }

      const result = await service.createCategory(ctx, input)
      expect(result).toBeDefined()
      expect(result.name).toBe('Electronics')

      const categoryFromDb = await repo.findByNameAndType(
        result.name,
        result.category_type,
      )
      expect(categoryFromDb).toBeDefined()
      expect(categoryFromDb?.name).toBe('Electronics')
    })

    it('should throw a ConflictException if category already exists', async () => {
      const input: CreateCategoryDto = {
        name: 'Electronics',
        category_type: CategoryType.PRODUCT,
        parent_category_id: null,
        content: '<p>Content</p>',
        content_type: 'MD',
      }

      await db.category.create({
        data: {
          name: input.name,
          category_type: input.category_type,
          parent_category_id: input.parent_category_id,
          content: input.content,
          content_type: 'MD',
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
          category_type: CategoryType.PRODUCT,
          parent_category_id: null,
          content: '<p>Content</p>',
          content_type: 'MD',
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
          category_type: CategoryType.PRODUCT,
          parent_category_id: null,
          content: '<p>Content</p>',
          content_type: 'MD',
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
