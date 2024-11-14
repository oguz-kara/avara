import { RequestContext } from '@avara/core/application/context/request-context'
import { CoreRepositories } from '@avara/core/shared/core-repositories'
import { CategoryMapper } from '@avara/core/domain/category/infrastructure/mappers/category.mapper'
import { CategoryRepository } from '@avara/core/domain/category/infrastructure/repositories/category.repository'
import { Channel } from '@avara/core/domain/channel/domain/entities/channel.entity'
import { ChannelMapper } from '@avara/core/domain/channel/infrastructure/mappers/channel.mapper'
import { ChannelRepository } from '@avara/core/domain/channel/infrastructure/repositories/channel.repository'
import { CreateSeoMetadataDto } from '@avara/core/domain/seo-metadata/api/graphql/dto/seo-metadata.dto'
import { SeoMetadataService } from '@avara/core/domain/seo-metadata/application/services/seo-metadata.service'
import { SeoMetadataMapper } from '@avara/core/domain/seo-metadata/infrastructure/mappers/seo-metadata.mapper'
import { SeoMetadataRepository } from '@avara/core/domain/seo-metadata/infrastructure/repositories/seo-metadata.repository'
import { appConfig } from '@avara/core/domain/user/config/app.config'
import { AdministratorMapper } from '@avara/core/domain/user/infrastructure/mappers/administrator.mapper'
import { PermissionMapper } from '@avara/core/domain/user/infrastructure/mappers/permission.mapper'
import { RolePermissionMapper } from '@avara/core/domain/user/infrastructure/mappers/role-permission.mapper'
import { RoleMapper } from '@avara/core/domain/user/infrastructure/mappers/role.mapper'
import { UserMapper } from '@avara/core/domain/user/infrastructure/mappers/user.mapper'
import { AdministratorRepository } from '@avara/core/domain/user/infrastructure/orm/repository/administrator.repository'
import { PermissionRepository } from '@avara/core/domain/user/infrastructure/orm/repository/permission.repository'
import { RolePermissionRepository } from '@avara/core/domain/user/infrastructure/orm/repository/role-permission.repository'
import { RoleRepository } from '@avara/core/domain/user/infrastructure/orm/repository/role.repository'
import { UserRepository } from '@avara/core/domain/user/infrastructure/orm/repository/user.repository'
import { DbService } from '@avara/shared/database/db-service'
import { DomainValidationError } from '@avara/shared/errors/domain-validation.error'
import { PaginationUtils } from '@avara/shared/utils/pagination.util'
import { NotFoundException } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

describe('SeoMetadataService (Integration)', () => {
  let seoMetadataService: SeoMetadataService
  let dbService: DbService
  let channelRepository: ChannelRepository
  let ctx: RequestContext

  const input: CreateSeoMetadataDto = {
    title: 'Sample Title',
    description: 'Sample Description',
    keywords: 'sample, keywords',
    canonical_url: 'https://example.com',
    robots: 'index, follow',
    og_title: 'Sample OG Title',
    og_description: 'Sample OG Description',
    og_image: 'https://example.com/og-image.jpg',
    version: 1,
    hreflang: 'en',
    page_type: 'website',
    schema_markup: 'website',
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig],
        }),
      ],
      providers: [
        SeoMetadataService,
        SeoMetadataRepository,
        SeoMetadataMapper,
        DbService,
        PermissionRepository,
        PermissionMapper,
        AdministratorRepository,
        AdministratorMapper,
        UserRepository,
        UserMapper,
        RolePermissionRepository,
        RolePermissionMapper,
        CategoryRepository,
        CategoryMapper,
        RoleRepository,
        RoleMapper,
        PaginationUtils,
        ConfigService,
        ChannelRepository,
        ChannelMapper,
        CoreRepositories,
      ],
    }).compile()

    dbService = module.get<DbService>(DbService)
    seoMetadataService = module.get<SeoMetadataService>(SeoMetadataService)
    channelRepository = module.get<ChannelRepository>(ChannelRepository)

    await dbService.$transaction([
      dbService.seoMetadata.deleteMany(),
      dbService.permission.deleteMany(),
      dbService.user.deleteMany(),
      dbService.role.deleteMany(),
      dbService.channel.deleteMany(),
    ])

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
    await dbService.$transaction([
      dbService.seoMetadata.deleteMany(),
      dbService.permission.deleteMany(),
      dbService.user.deleteMany(),
      dbService.role.deleteMany(),
    ])
  })

  afterAll(async () => {
    await dbService.$transaction([
      dbService.seoMetadata.deleteMany(),
      dbService.permission.deleteMany(),
      dbService.user.deleteMany(),
      dbService.role.deleteMany(),
      dbService.channel.deleteMany(),
    ])
  })

  describe('createSeoMetadata', () => {
    it('should create a new seoMetadata successfully', async () => {
      const result = await seoMetadataService.createOne(ctx, input)

      const seoMetadata = await dbService.seoMetadata.findFirst({
        where: {
          id: result.id,
        },
        include: {
          channels: true,
        },
      })

      expect(seoMetadata.channels).toHaveLength(1)
      expect(seoMetadata.channels[0].id).toBe(ctx.channel_id)

      expect(result).toBeTruthy()
      expect(result.title).toBe(input.title)
      expect(result.description).toBe(input.description)
      expect(result.keywords).toBe(input.keywords)
      expect(result.canonical_url).toBe(input.canonical_url)
      expect(result.robots).toBe(input.robots)
      expect(result.og_title).toBe(input.og_title)
      expect(result.og_description).toBe(input.og_description)
      expect(result.og_image).toBe(input.og_image)
      expect(result.version).toBe(input.version)
      expect(result.hreflang).toBe(input.hreflang)
      expect(result.page_type).toBe(input.page_type)
      expect(result.schema_markup).toBe(input.schema_markup)
    })

    it('should throw an error if title is invalid', async () => {
      const invalidInput = { ...input, title: '' }

      await expect(
        seoMetadataService.createOne(ctx, invalidInput),
      ).rejects.toThrow(DomainValidationError)
    })
  })

  describe('updateSeoMetadata', () => {
    it('should update an existing seoMetadata successfully', async () => {
      const createdData = await seoMetadataService.createOne(ctx, input)

      const updatedInput = {
        title: 'Updated Title',
        description: 'Updated Description',
        keywords: 'updated, keywords',
        canonical_url: 'https://example.com/updated',
        robots: 'noindex, nofollow',
        og_title: 'Updated OG Title',
        og_description: 'Updated OG Description',
        og_image: 'https://example.com/updated-og-image.jpg',
        version: 2,
        hreflang: 'es',
        page_type: 'article',
        schema_markup: 'article',
      }

      const result = await seoMetadataService.updateOne(
        ctx,
        createdData.id,
        updatedInput,
      )

      expect(result).toBeTruthy()
      expect(result.title).toBe(updatedInput.title)
      expect(result.description).toBe(updatedInput.description)
      expect(result.keywords).toBe(updatedInput.keywords)
      expect(result.canonical_url).toBe(updatedInput.canonical_url)
      expect(result.robots).toBe(updatedInput.robots)
      expect(result.og_title).toBe(updatedInput.og_title)
      expect(result.og_description).toBe(updatedInput.og_description)
      expect(result.og_image).toBe(updatedInput.og_image)
      expect(result.version).toBe(updatedInput.version)
      expect(result.hreflang).toBe(updatedInput.hreflang)
      expect(result.page_type).toBe(updatedInput.page_type)
      expect(result.schema_markup).toBe(updatedInput.schema_markup)
    })

    it('should throw an error if update title is invalid', async () => {
      const createdData = await seoMetadataService.createOne(ctx, input)

      const updatedInput = {
        title: '',
        description: 'Updated Description',
        keywords: 'updated, keywords',
        canonical_url: 'https://example.com/updated',
        robots: 'noindex, nofollow',
        og_title: 'Updated OG Title',
        og_description: 'Updated OG Description',
        og_image: 'https://example.com/updated-og-image.jpg',
        version: 2,
        hreflang: 'es',
        page_type: 'article',
        schema_markup: 'article',
      }

      await expect(
        seoMetadataService.updateOne(ctx, createdData.id, updatedInput),
      ).rejects.toThrow(DomainValidationError)
    })
  })

  describe('findOne', () => {
    it('should find single seo metadata by id', async () => {
      const createdData = await seoMetadataService.createOne(ctx, input)

      const result = await seoMetadataService.findOne(ctx, createdData.id)

      expect(result).toBeTruthy()
      expect(result?.title).toBe(input.title)
      expect(result?.description).toBe(input.description)
      expect(result?.keywords).toBe(input.keywords)
      expect(result?.canonical_url).toBe(input.canonical_url)
      expect(result?.robots).toBe(input.robots)
      expect(result?.og_title).toBe(input.og_title)
      expect(result?.og_description).toBe(input.og_description)
      expect(result?.og_image).toBe(input.og_image)
      expect(result?.version).toBe(input.version)
      expect(result?.hreflang).toBe(input.hreflang)
      expect(result?.page_type).toBe(input.page_type)
      expect(result?.schema_markup).toBe(input.schema_markup)
    })

    it('should return null if no metadata exists with given id', async () => {
      const result = await seoMetadataService.findOne(ctx, 'invalid-id')

      expect(result).toBeNull()
    })
  })

  describe('findMany', () => {
    it('should find many seo metadata successfully', async () => {
      const createdData1 = await seoMetadataService.createOne(ctx, input)
      const createdData2 = await seoMetadataService.createOne(ctx, input)
      const createdData3 = await seoMetadataService.createOne(ctx, input)

      const result = await seoMetadataService.findMany(ctx)

      expect(result).toBeTruthy()
      expect(result.items).toHaveLength(3)
      expect(result.items[0].title).toBe(createdData1.title)
      expect(result.items[1].title).toBe(createdData2.title)
      expect(result.items[2].title).toBe(createdData3.title)
      expect(result.pagination.total).toBe(3)
    })

    it('should return empty array if no metadata exists', async () => {
      const result = await seoMetadataService.findMany(ctx)

      expect(result).toBeTruthy()
      expect(result.items).toHaveLength(0)
      expect(result.pagination.total).toBe(0)
    })
  })

  describe('removeOne', () => {
    it('should remove a single seo metadata successfully', async () => {
      const createdData = await seoMetadataService.createOne(ctx, input)

      await seoMetadataService.removeOne(ctx, createdData.id)

      const result = await dbService.seoMetadata.findFirst({
        where: {
          id: createdData.id,
        },
      })

      expect(result).toBeNull()
    })

    it('should throw an error if metadata does not exist', async () => {
      await expect(
        seoMetadataService.removeOne(ctx, 'invalid-id'),
      ).rejects.toThrow(NotFoundException)
    })
  })
})