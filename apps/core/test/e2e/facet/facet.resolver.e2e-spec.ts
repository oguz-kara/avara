import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { DbService } from '@avara/shared/database/db-service'
import { CoreModule } from '@avara/core/core.module'
import { createDefaultChannelIfNotExists } from '../channel/helpers/create-default-channel'
import { faker } from '@faker-js/faker'

describe('FacetResolver (e2e)', () => {
  let app: INestApplication
  let dbService: DbService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    dbService = moduleFixture.get<DbService>(DbService)

    await createDefaultChannelIfNotExists(dbService)
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
    await dbService.facet.deleteMany()
  })

  describe('createFacet', () => {
    it('should create a new facet', async () => {
      const graphql = `
        mutation {
          createFacet(input: {
            name: "${faker.commerce.productAdjective()}",
            code: "${faker.string.alphanumeric(10)}",
            isPrivate: ${faker.datatype.boolean()}
          }) {
            id
            name
            code
            isPrivate
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: graphql })

      const data = response.body.data.createFacet

      expect(data).toBeDefined()
      expect(data.name).toBeTruthy()
      expect(data.code).toBeTruthy()
      expect(typeof data.isPrivate).toBe('boolean')
    })
  })

  describe('editFacet', () => {
    it('should update an existing facet', async () => {
      const facet = await dbService.facet.create({
        data: {
          name: faker.commerce.productAdjective(),
          code: faker.string.alphanumeric(10),
          isPrivate: faker.datatype.boolean(),
        },
      })

      const graphql = `
        mutation {
          editFacet(id: "${facet.id}", input: {
            name: "${faker.commerce.productAdjective()} updated",
            code: "${faker.string.alphanumeric(10)} updated",
            isPrivate: ${!facet.isPrivate}
          }) {
            id
            name
            code
            isPrivate
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: graphql })

      const data = response.body.data.editFacet

      expect(data).toBeDefined()
      expect(data.id).toBe(facet.id)
      expect(data.name).toContain('updated')
      expect(data.code).toContain('updated')
      expect(data.isPrivate).toBe(!facet.isPrivate)
    })
  })

  describe('deleteFacet', () => {
    it('should delete a facet by ID', async () => {
      const facet = await dbService.facet.create({
        data: {
          name: faker.commerce.productAdjective(),
          code: faker.string.alphanumeric(10),
          isPrivate: faker.datatype.boolean(),
        },
      })

      const graphql = `
        mutation {
          deleteFacet(id: "${facet.id}") {
            id
            name
            code
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: graphql })

      console.log({ deletefacet: JSON.stringify(response.body) })

      const data = response.body.data.deleteFacet

      expect(data).toBeDefined()
      expect(data.id).toBe(facet.id)

      const facetInDb = await dbService.facet.findUnique({
        where: { id: facet.id },
      })
      expect(facetInDb).toBeNull()
    })
  })

  describe('findFacetById', () => {
    it('should return a facet by ID', async () => {
      const facet = await dbService.facet.create({
        data: {
          name: faker.commerce.productAdjective(),
          code: faker.string.alphanumeric(10),
          isPrivate: faker.datatype.boolean(),
        },
      })

      const graphql = `
        query {
          findFacetById(id: "${facet.id}") {
            id
            name
            code
            isPrivate
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: graphql })

      console.log({ findbyid: JSON.stringify(response.body) })

      const data = response.body.data.findFacetById

      expect(data).toBeDefined()
      expect(data.id).toBe(facet.id)
      expect(data.name).toBe(facet.name)
      expect(data.code).toBe(facet.code)
      expect(data.isPrivate).toBe(facet.isPrivate)
    })
  })

  describe('facetList', () => {
    it('should return a paginated list of facets', async () => {
      await dbService.facet.createMany({
        data: Array(5)
          .fill(0)
          .map(() => ({
            name: faker.commerce.productAdjective(),
            code: faker.string.alphanumeric(10),
            isPrivate: faker.datatype.boolean(),
          })),
      })

      const graphql = `
        query {
          facets(input: { limit: 3, position: 0 }) {
            items {
              id
              name
              code
              isPrivate
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

      const data = response.body.data.facetList

      expect(data.items).toHaveLength(3)
      expect(data.pagination.total).toBe(5)
      expect(data.pagination.limit).toBe(3)
      expect(data.pagination.position).toBe(0)
    })
  })
})
