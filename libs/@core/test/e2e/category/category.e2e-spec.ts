import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { DbService } from '@avara/shared/database/db-service'
import { CategoryType } from '@prisma/client'
import { AppModule } from 'apps/avara/src/app.module'

describe('CategoryResolver (e2e)', () => {
  let app: INestApplication
  let dbService: DbService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    dbService = moduleFixture.get<DbService>(DbService)
  })

  afterAll(async () => {
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
            category_type: PRODUCT,
            parent_category_id: null,
            content: "<p>Some content</p>"
            content_type: "MD"
          }) {
            id
            name
            parent_category_id
            category_type
            content 
            content_type
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
        where: { id: response.body.data.createCategory.id },
      })

      expect(savedCategory).toBeTruthy()
      expect(savedCategory.name).toBe('Electronics')
      expect(savedCategory.parent_category_id).toBe(null)
      expect(savedCategory.content).toBe('<p>Some content</p>')
    })

    it('should throw ConflictException if category already exists', async () => {
      // Create a category directly in the database
      await dbService.category.create({
        data: {
          name: 'Electronics',
          category_type: CategoryType.PRODUCT,
          parent_category_id: null,
          content: '<p>Some content</p>',
          content_type: 'MD',
        },
      })

      const createCategoryMutation = `
        mutation {
          createCategory(input: {
            name: "Electronics",
            category_type: PRODUCT,
            parent_category_id: null,
            content: "<p>Some content</p>"
            content_type: "MD"
          }) {
            id
            name
            category_type
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
          category_type: CategoryType.PRODUCT,
          parent_category_id: null,
          content: '<p>Some content</p>',
          content_type: 'MD',
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

      // Verify that the category is removed from the database
      const deletedCategory = await dbService.category.findUnique({
        where: { id: category.id },
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
          category_type: CategoryType.PRODUCT,
          parent_category_id: null,
          content: '<p>Some content</p>',
          content_type: 'MD',
        },
      })
      await dbService.category.create({
        data: {
          name: 'Appliances',
          category_type: CategoryType.PRODUCT,
          parent_category_id: null,
          content: '<p>Another content</p>',
          content_type: 'MD',
        },
      })

      const categoriesQuery = `
        query {
          categories(input: { type: PRODUCT, limit: 10, position: 0 }) {
            items {
              id
              name
              category_type
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
          category_type: CategoryType.PRODUCT,
          parent_category_id: null,
          content: '<p>Some content</p>',
          content_type: 'MD',
        },
      })

      const findCategoryQuery = `
        query {
          findCategoryById(input: { id: "${category.id}" }) {
            id
            name
            category_type
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
            category_type
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
