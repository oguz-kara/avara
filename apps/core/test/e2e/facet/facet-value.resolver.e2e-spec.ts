import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { DbService } from '@avara/shared/database/db-service'
import { CoreModule } from '@avara/core/core.module'
import { createDefaultChannelIfNotExists } from '../channel/helpers/create-default-channel'
import { faker } from '@faker-js/faker'

describe('FacetValueResolver (e2e)', () => {
  let app: INestApplication
  let dbService: DbService
  let defaultFacetId: string

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    dbService = moduleFixture.get<DbService>(DbService)

    await createDefaultChannelIfNotExists(dbService)

    // Create a default facet for testing FacetValues
    const defaultFacet = await dbService.facet.create({
      data: {
        name: faker.commerce.productAdjective(),
        code: faker.string.alphanumeric(10),
        isPrivate: false,
      },
    })
    defaultFacetId = defaultFacet.id
  })

  afterAll(async () => {
    await dbService.facetValue.deleteMany()
    await dbService.facet.deleteMany()
    await dbService.channel.deleteMany()
    await dbService.$disconnect()
    await app.close()
  })

  beforeEach(async () => {
    await dbService.facetValue.deleteMany()
  })

  describe('createFacetValue', () => {
    it('should create a new facet value', async () => {
      const graphql = `
        mutation {
          createFacetValue(input: {
            name: "${faker.commerce.productName()}",
            code: "${faker.string.alphanumeric(10)}",
            facetId: "${defaultFacetId}"
          }) {
            id
            name
            code
            facetId
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: graphql })

      const data = response.body.data.createFacetValue

      expect(data).toBeDefined()
      expect(data.name).toBeTruthy()
      expect(data.code).toBeTruthy()
      expect(data.facetId).toBe(defaultFacetId)
    })
  })

  describe('updateFacetValue', () => {
    it('should update an existing facet value', async () => {
      const facetValue = await dbService.facetValue.create({
        data: {
          name: faker.commerce.productName(),
          code: faker.string.alphanumeric(10),
          facet: {
            connect: { id: defaultFacetId },
          },
        },
      })

      const graphql = `
        mutation {
          updateFacetValue(id: "${facetValue.id}", input: {
            name: "${facetValue.name} updated",
            code: "${facetValue.code} updated"
          }) {
            id
            name
            code
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: graphql })

      const data = response.body.data.updateFacetValue

      expect(data).toBeDefined()
      expect(data.id).toBe(facetValue.id)
      expect(data.name).toContain('updated')
      expect(data.code).toContain('updated')
    })
  })

  describe('deleteFacetValue', () => {
    it('should delete a facet value by ID', async () => {
      const facetValue = await dbService.facetValue.create({
        data: {
          name: faker.commerce.productName(),
          code: faker.string.alphanumeric(10),
          facet: {
            connect: { id: defaultFacetId },
          },
        },
      })

      const graphql = `
        mutation {
          deleteFacetValue(id: "${facetValue.id}") {
            id
            name
            code
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: graphql })

      const data = response.body.data.deleteFacetValue

      expect(data).toBeDefined()
      expect(data.id).toBe(facetValue.id)

      const facetValueInDb = await dbService.facetValue.findUnique({
        where: { id: facetValue.id },
      })
      expect(facetValueInDb).toBeNull()
    })
  })

  describe('findFacetValueById', () => {
    it('should return a facet value by ID', async () => {
      const facetValue = await dbService.facetValue.create({
        data: {
          name: faker.commerce.productName(),
          code: faker.string.alphanumeric(10),
          facet: {
            connect: { id: defaultFacetId },
          },
        },
      })

      const graphql = `
        query {
          findFacetValueById(id: "${facetValue.id}") {
            id
            name
            code
            facetId
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: graphql })

      const data = response.body.data.findFacetValueById

      expect(data).toBeDefined()
      expect(data.id).toBe(facetValue.id)
      expect(data.name).toBe(facetValue.name)
      expect(data.code).toBe(facetValue.code)
      expect(data.facetId).toBe(defaultFacetId)
    })
  })

  describe('facetValueList', () => {
    it('should return a paginated list of facet values', async () => {
      await dbService.facetValue.createMany({
        data: Array(5)
          .fill(0)
          .map(() => ({
            name: faker.commerce.productName(),
            code: faker.string.alphanumeric(10),
            facetId: defaultFacetId,
          })),
      })

      const graphql = `
        query {
          facetValueList(input: { limit: 3, position: 0 }) {
            items {
              id
              name
              code
              facetId
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
        .send({ query: graphql })

      const data = response.body.data.facetValueList

      expect(data.items).toHaveLength(3)
      expect(data.pagination.total).toBe(5)
      expect(data.pagination.limit).toBe(3)
      expect(data.pagination.position).toBe(0)
    })
  })
})
