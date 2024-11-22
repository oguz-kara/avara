import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { DbService } from '@avara/shared/database/db-service'
import { createChannelListOnDb } from './helpers/create-channel-list-on-db'
import { ChannelRepository } from '@avara/core/domain/channel/infrastructure/repositories/channel.repository'
import { findChannelsQuery } from './queries/find-channels.query'
import { CoreModule } from '@avara/core/core.module'

describe('ChannelResolver (e2e)', () => {
  let app: INestApplication
  let dbService: DbService
  let channelRepo: ChannelRepository

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    dbService = moduleFixture.get<DbService>(DbService)
    channelRepo = moduleFixture.get<ChannelRepository>(ChannelRepository)
    await dbService.channel.deleteMany()
  })

  afterAll(async () => {
    await dbService.$disconnect()
    await app.close()
  })

  beforeEach(async () => {
    await dbService.channel.deleteMany()
  })

  describe('createChannel', () => {
    it('should create a new channel successfully', async () => {
      const createChannelMutation = `
        mutation {
          createChannel(input: { name: "Global Channel", code: "GLOBAL", currencyCode: "USD", defaultLanguageCode: "EN", isDefault: true }) {
            id
            name
            code
            currencyCode
            defaultLanguageCode
            isDefault
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: createChannelMutation })

      expect(response.status).toBe(200)
      expect(response.body.data.createChannel).toBeTruthy()
      expect(response.body.data.createChannel.name).toBe('Global Channel')
      expect(response.body.data.createChannel.code).toBe('GLOBAL')

      const savedChannel = await dbService.channel.findUnique({
        where: { id: response.body.data.createChannel.id },
      })

      expect(savedChannel).toBeTruthy()
      expect(savedChannel?.name).toBe('Global Channel')
      expect(savedChannel?.code).toBe('GLOBAL')
    })

    it('should throw ConflictException if channel already exists', async () => {
      await dbService.channel.create({
        data: {
          name: 'Global Channel',
          code: 'GLOBAL',
          currencyCode: 'USD',
          defaultLanguageCode: 'EN',
          isDefault: true,
        },
      })

      const createChannelMutation = `
        mutation {
          createChannel(input: { name: "Global Channel", code: "GLOBAL", currencyCode: "USD", defaultLanguageCode: "EN", isDefault: true }) {
            id
            name
            code
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: createChannelMutation })

      expect(response.status).toBe(200)
      expect(response.body.errors).toBeTruthy()
      expect(response.body.errors[0].message).toContain(
        'Channel already exists!',
      )
    })
  })

  describe('findChannelById', () => {
    it('should find a channel by id successfully', async () => {
      const channel = await dbService.channel.create({
        data: {
          name: 'Global Channel',
          code: 'GLOBAL',
          currencyCode: 'USD',
          defaultLanguageCode: 'EN',
          isDefault: true,
        },
      })

      const findChannelByIdQuery = `
        query {
          findChannelById(input: { id: "${channel.id}" }) {
            id
            name
            code
            currencyCode
            defaultLanguageCode
            isDefault
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: findChannelByIdQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.findChannelById).toBeTruthy()
      expect(response.body.data.findChannelById.id).toBe(channel.id)
    })

    it('should return null if channel not found', async () => {
      const findChannelByIdQuery = `
        query {
          findChannelById(input: { id: "non-existent-id" }) {
            id
            name
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: findChannelByIdQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.findChannelById).toBeNull()
    })
  })

  describe('findChannelByCode', () => {
    it('should find a channel by code successfully', async () => {
      const channel = await dbService.channel.create({
        data: {
          name: 'Global Channel',
          code: 'GLOBAL',
          currencyCode: 'USD',
          defaultLanguageCode: 'EN',
          isDefault: true,
        },
      })

      const findChannelByCodeQuery = `
        query {
          findChannelByCode(input: { code: "GLOBAL" }) {
            id
            name
            code
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: findChannelByCodeQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.findChannelByCode).toBeTruthy()
      expect(response.body.data.findChannelByCode.code).toBe(channel.code)
    })

    it('should return null if channel code not found', async () => {
      const findChannelByCodeQuery = `
        query {
          findChannelByCode(input: { code: "NONeXISTENT" }) {
            id
            name
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: findChannelByCodeQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.findChannelByCode).toBeNull()
    })
  })

  describe('channels', () => {
    it('should retrieve channels with pagination', async () => {
      await dbService.channel.create({
        data: {
          name: 'Channel One',
          code: 'ONE',
          currencyCode: 'USD',
          defaultLanguageCode: 'EN',
          isDefault: false,
        },
      })
      await dbService.channel.create({
        data: {
          name: 'Channel Two',
          code: 'TWO',
          currencyCode: 'EUR',
          defaultLanguageCode: 'FR',
          isDefault: false,
        },
      })

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: findChannelsQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.channels.items).toHaveLength(3)
      expect(response.body.data.channels.pagination.total).toBe(3)
    })

    it('should return an default channel when no channels exist', async () => {
      const findChannelsQuery = `
        query {
          channels(input: { limit: 10, position: 0 }) {
            items {
              id
              name
            }
            pagination {
              total
              limit
              position
            }
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: findChannelsQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.channels.items).toHaveLength(1)
    })
  })

  describe('markChannelAsDeleted', () => {
    it('should mark the channel as deleted by ID', async () => {
      const channel = await dbService.channel.create({
        data: {
          name: 'Channel Marked',
          code: 'MARKED',
          currencyCode: 'USD',
          defaultLanguageCode: 'EN',
          isDefault: false,
        },
      })

      const markChannelAsDeletedMutation = `
        mutation {
          markChannelAsDeleted(input: { id: "${channel.id}" }) {
            id
            name
            deletedAt
            deletedBy
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: markChannelAsDeletedMutation })

      expect(response.status).toBe(200)
      expect(response.body.data.markChannelAsDeleted).toBeTruthy()
      expect(response.body.data.markChannelAsDeleted.deletedAt).toBeTruthy()
      expect(response.body.data.markChannelAsDeleted.deletedBy).toBeTruthy()

      const markedChannel = await dbService.channel.findUnique({
        where: { id: channel.id },
      })
      expect(markedChannel?.deletedAt).toBeTruthy()
      expect(markedChannel?.deletedBy).toBeTruthy()
    })

    it('should be filter if a channel is already marked as deleted', async () => {
      // creates 6 channels in the real db
      await createChannelListOnDb(dbService)

      const channelsData = await channelRepo.findMany({
        limit: 25,
        position: 0,
      })

      expect(channelsData.items).toHaveLength(6)

      const channel = channelsData.items[0]

      const markChannelAsDeletedMutation = `
      mutation {
        markChannelAsDeleted(input: { id: "${channel.id}" }) {
          id
          name
          deletedAt
          deletedBy
        }
      }
    `

      // marks the first channel as deleted
      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: markChannelAsDeletedMutation })

      expect(response.status).toBe(200)
      expect(response.body.data.markChannelAsDeleted).toBeTruthy()
      expect(response.body.data.markChannelAsDeleted.deletedAt).toBeTruthy()
      expect(response.body.data.markChannelAsDeleted.deletedBy).toBeTruthy()

      const findManyResponse = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: findChannelsQuery })

      expect(findManyResponse.status).toBe(200)
      expect(findManyResponse.body.data.channels.items).toHaveLength(5)
    })

    it('should throw NotFoundException if channel does not exist', async () => {
      const markChannelAsDeletedMutation = `
        mutation {
          markChannelAsDeleted(input: { id: "non-existent-id" }) {
            id
            name
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: markChannelAsDeletedMutation })

      expect(response.status).toBe(200)
      expect(response.body.errors).toBeTruthy()
      expect(response.body.errors[0].message).toContain(
        'Channel not found to remove!',
      )
    })
  })
})
