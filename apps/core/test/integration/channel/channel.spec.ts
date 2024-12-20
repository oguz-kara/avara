import { Test, TestingModule } from '@nestjs/testing'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { ChannelService } from '@avara/core/domain/channel/application/services/channel.service'
import { ChannelRepository } from '@avara/core/domain/channel/infrastructure/repositories/channel.repository'
import { PaginationUtils } from '@avara/shared/utils/pagination.util'
import { ConfigService } from '@nestjs/config'
import { DbService } from '@avara/shared/database/db-service'
import { CreateChannelDto } from '@avara/core/domain/channel/api/graphql/dto/create-channel.dto'
import { ChannelMapper } from '@avara/core/domain/channel/infrastructure/mappers/channel.mapper'

describe('ChannelService (Integration)', () => {
  let service: ChannelService
  let db: DbService
  let repo: ChannelRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChannelService,
        ChannelRepository,
        DbService,
        ChannelMapper,
        PaginationUtils,
        ConfigService,
      ],
    }).compile()

    service = module.get<ChannelService>(ChannelService)
    db = module.get<DbService>(DbService)
    repo = module.get<ChannelRepository>(ChannelRepository)
  })

  beforeEach(async () => {
    await db.$transaction([db.channel.deleteMany()])
  })

  afterAll(async () => {
    await db.$transaction([db.channel.deleteMany()])
  })

  describe('createChannel', () => {
    it('should create a new channel successfully', async () => {
      const input: CreateChannelDto = {
        name: 'Global Channel',
        code: 'GLOBAL',
        currencyCode: 'USD',
        defaultLanguageCode: 'EN',
        isDefault: true,
      }

      const result = await service.createChannel(input)
      expect(result).toBeDefined()
      expect(result.name).toBe('Global Channel')
      expect(result.code).toBe('GLOBAL')

      const channelFromDb = await repo.findByCode(result.code)
      expect(channelFromDb).toBeDefined()
      expect(channelFromDb?.name).toBe('Global Channel')
    })

    it('should throw ConflictException if the channel already exists', async () => {
      const input: CreateChannelDto = {
        name: 'Global Channel',
        code: 'GLOBAL',
        currencyCode: 'USD',
        defaultLanguageCode: 'EN',
        isDefault: true,
      }

      await db.channel.create({
        data: {
          name: input.name,
          code: input.code,
          currencyCode: input.currencyCode,
          defaultLanguageCode: input.defaultLanguageCode,
          isDefault: input.isDefault,
        },
      })

      await expect(service.createChannel(input)).rejects.toThrow(
        ConflictException,
      )
    })
  })

  describe('editChannel', () => {
    it('should update an existing channel successfully', async () => {
      const channel = await db.channel.create({
        data: {
          name: 'Global Channel',
          code: 'GLOBAL',
          currencyCode: 'USD',
          defaultLanguageCode: 'EN',
          isDefault: true,
        },
      })

      const updatedInput = { name: 'Updated Channel' }
      const result = await service.editChannel(channel.id, updatedInput)
      expect(result).toBeDefined()
      expect(result.name).toBe('Updated Channel')

      const channelFromDb = await repo.findById(channel.id)
      expect(channelFromDb?.name).toBe('Updated Channel')
    })

    it('should throw NotFoundException if channel does not exist', async () => {
      await expect(
        service.editChannel('non-existing-id', { name: 'Updated Channel' }),
      ).rejects.toThrow(NotFoundException)
    })

    it('should throw ConflictException if code is already taken by another channel', async () => {
      await db.channel.create({
        data: {
          name: 'Existing Channel',
          code: 'EXISTING',
          currencyCode: 'USD',
          defaultLanguageCode: 'EN',
          isDefault: false,
        },
      })

      const channel = await db.channel.create({
        data: {
          name: 'Test Channel',
          code: 'TEST',
          currencyCode: 'USD',
          defaultLanguageCode: 'EN',
          isDefault: false,
        },
      })

      await expect(
        service.editChannel(channel.id, { code: 'EXISTING' }),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('getChannelById', () => {
    it('should return a channel if it exists', async () => {
      const channel = await db.channel.create({
        data: {
          name: 'Test Channel',
          code: 'TEST',
          currencyCode: 'USD',
          defaultLanguageCode: 'EN',
          isDefault: false,
        },
      })

      const result = await service.getChannelById(channel.id)
      expect(result).toBeDefined()
      expect(result?.name).toBe('Test Channel')
    })

    it('should return null if channel does not exist', async () => {
      const result = await service.getChannelById('non-existing-id')
      expect(result).toBeNull()
    })
  })

  describe('removeChannelById', () => {
    it('should remove the channel if it exists', async () => {
      const channel = await db.channel.create({
        data: {
          name: 'Test Channel',
          code: 'TEST',
          currencyCode: 'USD',
          defaultLanguageCode: 'EN',
          isDefault: false,
        },
      })

      const result = await service.removeChannelById(channel.id)
      expect(result).toBeDefined()
      expect(result.id).toBe(channel.id)

      const channelFromDb = await db.channel.findUnique({
        where: { id: channel.id },
      })
      expect(channelFromDb).toBeNull()
    })

    it('should throw NotFoundException if channel does not exist', async () => {
      await expect(
        service.removeChannelById('non-existing-id'),
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('markChannelAsDeleted', () => {
    it('should mark the channel as deleted if it exists', async () => {
      const channel = await db.channel.create({
        data: {
          name: 'Test Channel',
          code: 'TEST',
          currencyCode: 'USD',
          defaultLanguageCode: 'EN',
          isDefault: false,
        },
      })

      const result = await service.markChannelAsDeleted(channel.id)
      expect(result).toBeDefined()
      expect(result.deletedAt).toBeTruthy()
      expect(result.deletedBy).toBeTruthy()

      const channelFromDb = await repo.findById(channel.id)
      expect(channelFromDb?.deletedBy).toBeTruthy()
    })

    it('should throw NotFoundException if channel does not exist', async () => {
      await expect(
        service.markChannelAsDeleted('non-existing-id'),
      ).rejects.toThrow(NotFoundException)
    })
  })
})
