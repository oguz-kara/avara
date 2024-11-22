import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { DbService } from '@avara/shared/database/db-service'
import { CategoryType } from '@prisma/client'
import { CoreModule } from '@avara/core/core.module'
import { createDefaultChannelIfNotExists } from '../channel/helpers/create-default-channel'

describe('CategoryResolver (e2e)', () => {
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
    await dbService.channel.deleteMany()
    await dbService.$disconnect()
    await app.close()
  })

  beforeEach(async () => {
    await dbService.category.deleteMany()
  })

  describe('createCategory', () => {
    it('should create a new product category successfully', async () => {
      const createCategoryMutation = `
        mutation {
          createCategory(input: {
            name: "Electronics",
            categoryType: PRODUCT,
            parentCategoryId: null,
            content: "<p>Some content</p>"
            contentType: "MD"
          }) {
            id
            name
            parentCategoryId
            categoryType
            content 
            contentType
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: createCategoryMutation })

      expect(response.status).toBe(200)
      expect(response.body.data.createCategory).toBeTruthy()
      expect(response.body.data.createCategory.name).toBe('Electronics')

      const savedCategory = await dbService.category.findUnique({
        where: {
          id: response.body.data.createCategory.id,
          channels: { some: { code: 'default' } },
        },
      })

      expect(savedCategory).toBeTruthy()
      expect(savedCategory.name).toBe('Electronics')
      expect(savedCategory.parentCategoryId).toBe(null)
      expect(savedCategory.content).toBe('<p>Some content</p>')
    })

    it('should throw ConflictException if category already exists', async () => {
      // Create a category directly in the database
      await dbService.category.create({
        data: {
          name: 'Electronics',
          categoryType: CategoryType.PRODUCT,
          parentCategoryId: null,
          content: '<p>Some content</p>',
          contentType: 'MD',
          channels: {
            connect: {
              code: 'default',
            },
          },
        },
      })

      const createCategoryMutation = `
        mutation {
          createCategory(input: {
            name: "Electronics",
            categoryType: PRODUCT,
            parentCategoryId: null,
            content: "<p>Some content</p>"
            contentType: "MD"
          }) {
            id
            name
            categoryType
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: createCategoryMutation })

      const errors = response.body.errors

      expect(response.status).toBe(200)
      expect(errors).toBeTruthy()
      expect(errors[0].message).toContain('The category already exists!')
    })
  })

  describe('removeCategoryById', () => {
    it('should remove the product category successfully', async () => {
      const category = await dbService.category.create({
        data: {
          name: 'Electronics',
          categoryType: CategoryType.PRODUCT,
          parentCategoryId: null,
          content: '<p>Some content</p>',
          contentType: 'MD',
          channels: {
            connect: {
              code: 'default',
            },
          },
        },
      })

      const removeCategoryMutation = `
        mutation {
          removeCategoryById(input: { id: "${category.id}" }) {
            id
            name
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: removeCategoryMutation })

      expect(response.status).toBe(200)
      expect(response.body.data.removeCategoryById).toBeTruthy()
      expect(response.body.data.removeCategoryById.id).toBe(category.id)

      const deletedCategory = await dbService.category.findUnique({
        where: { id: category.id, channels: { some: { code: 'default' } } },
      })

      expect(deletedCategory).toBeNull()
    })

    it('should throw NotFoundException if category does not exist', async () => {
      const removeCategoryMutation = `
        mutation {
          removeCategoryById(input: { id: "non-existing-id" }) {
            id
            name
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: removeCategoryMutation })

      const errors = response.body.errors

      expect(response.status).toBe(200)
      expect(errors).toBeTruthy()
      expect(errors[0].message).toContain(
        'ProductCategory not found to remove!',
      )
    })
  })

  describe('categories', () => {
    it('should return paginated categories', async () => {
      await dbService.category.create({
        data: {
          name: 'Electronics',
          categoryType: CategoryType.PRODUCT,
          parentCategoryId: null,
          content: '<p>Some content</p>',
          contentType: 'MD',
          channels: {
            connect: {
              code: 'default',
            },
          },
        },
      })
      await dbService.category.create({
        data: {
          name: 'Appliances',
          categoryType: CategoryType.PRODUCT,
          parentCategoryId: null,
          content: '<p>Another content</p>',
          contentType: 'MD',
          channels: {
            connect: {
              code: 'default',
            },
          },
        },
      })

      const categoriesQuery = `
        query {
          categories(input: { type: PRODUCT, limit: 10, position: 0 }) {
            items {
              id
              name
              categoryType
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
        .send({ query: categoriesQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.categories.items.length).toBe(2)
      expect(response.body.data.categories.pagination.total).toBe(2)
    })
  })

  describe('findCategoryById', () => {
    it('should return the category if it exists', async () => {
      const category = await dbService.category.create({
        data: {
          name: 'Electronics',
          categoryType: CategoryType.PRODUCT,
          parentCategoryId: null,
          content: '<p>Some content</p>',
          contentType: 'MD',
          channels: {
            connect: {
              code: 'default',
            },
          },
        },
      })

      const findCategoryQuery = `
        query {
          findCategoryById(input: { id: "${category.id}" }) {
            id
            name
            categoryType
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: findCategoryQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.findCategoryById).toBeTruthy()
      expect(response.body.data.findCategoryById.id).toBe(category.id)
    })

    it('should return null if category does not exist', async () => {
      const findCategoryQuery = `
        query {
          findCategoryById(input: { id: "non-existing-id" }) {
            id
            name
            categoryType
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: findCategoryQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.findCategoryById).toBeNull()
    })
  })
})
