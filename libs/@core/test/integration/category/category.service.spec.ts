import { Test, TestingModule } from '@nestjs/testing'
import { PaginationUtils } from '@avara/shared/utils/pagination.util'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { CategoryService } from '@avara/core/modules/category/application/services/category.service'
import { CategoryRepository } from '@avara/core/modules/category/infrastructure/repositories/category.repository'
import { CreateCategoryDto } from '@avara/core/modules/category/api/graphql/dto/create-category.dto'
import { CategoryType } from '@avara/core/modules/category/application/enums/category.enum'
import { DbService } from '@avara/shared/database/db-service'
import { CategoryMapper } from '@avara/core/modules/category/infrastructure/mappers/category.mapper'
import { ConfigService } from '@nestjs/config'
import { DBTransactionService } from '@avara/shared/database/db-transaction'

describe('CategoryService (Integration)', () => {
  let service: CategoryService
  let db: DbService
  let repo: CategoryRepository

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
      ],
    }).compile()

    service = module.get<CategoryService>(CategoryService)
    db = module.get<DbService>(DbService)
    repo = module.get<CategoryRepository>(CategoryRepository)
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

      const result = await service.createCategory(input)
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

      await expect(service.createCategory(input)).rejects.toThrow(
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

      const result = await service.findById(category.id)
      expect(result).toBeDefined()
      expect(result?.name).toBe('Electronics')
    })

    it('should return null if category does not exist', async () => {
      const result = await service.findById('non-existing-id')
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

      await service.removeProductCategoryById(category.id)

      const categoryFromDb = await db.category.findUnique({
        where: { id: category.id },
      })
      expect(categoryFromDb).toBeNull()
    })

    it('should throw NotFoundException if category does not exist', async () => {
      await expect(
        service.removeProductCategoryById('non-existing-id'),
      ).rejects.toThrow(NotFoundException)
    })
  })
})
