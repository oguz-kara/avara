import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { DbService } from '@avara/shared/database/db-service'
import { CoreModule } from '@avara/core/core.module'
import { createDefaultChannelIfNotExists } from '../channel/helpers/create-default-channel'

describe('SeoMetadataResolver (e2e)', () => {
  let app: INestApplication
  let dbService: DbService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CoreModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    dbService = moduleFixture.get<DbService>(DbService)

    await dbService.permission.deleteMany()

    await createDefaultChannelIfNotExists(dbService)
  })

  afterAll(async () => {
    await dbService.channel.deleteMany()
    await dbService.$disconnect()
    await app.close()
  })

  beforeEach(async () => {
    await dbService.seoMetadata.deleteMany()
    await dbService.category.deleteMany()
    await dbService.article.deleteMany()
  })

  describe('createSeoMetadata', () => {
    it('should create seo metadata', async () => {
      const graphql = `
      mutation {
        createSeoMetadata(input: {
        title: "test", 
        description: "test", 
        keywords: "test", 
        version: 1, 
        canonical_url: "test", 
        og_title: "test", 
        og_description: "test", 
        og_image: "test", 
        robots: "test", 
        schema_markup: "test", 
        hreflang: "test", 
        page_type: "test"
        }) {
        id
        title
        description
        keywords
        version
        canonical_url
        og_title
        og_description
        og_image
        robots
        schema_markup
        hreflang
        page_type
        }
      }
    `
      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: graphql })

      const data = response.body.data.createSeoMetadata

      expect(data.title).toBe('test')
      expect(data.description).toBe('test')
      expect(data.keywords).toBe('test')
      expect(data.version).toBe(1)
      expect(data.canonical_url).toBe('test')
      expect(data.og_title).toBe('test')
      expect(data.og_description).toBe('test')
      expect(data.og_image).toBe('test')
      expect(data.robots).toBe('test')
      expect(data.schema_markup).toBe('test')
      expect(data.hreflang).toBe('test')
      expect(data.page_type).toBe('test')
    })
  })

  describe('updateSeoMetadata', () => {
    it('should update seo metadata', async () => {
      const md = await dbService.seoMetadata.create({
        data: {
          title: 'test',
          description: 'test',
          keywords: 'test',
          version: 1,
          canonical_url: 'test',
          og_title: 'test',
          og_description: 'test',
          og_image: 'test',
          robots: 'test',
          schema_markup: 'test',
          hreflang: 'test',
          page_type: 'test',
          channels: {
            connect: {
              code: 'default',
            },
          },
        },
      })

      const graphql = `
        mutation {
          updateSeoMetadata(id: "${md.id}", input: {
          title: "test updated", 
          description: "test updated", 
          keywords: "test updated", 
          version: 2, 
          canonical_url: "test updated", 
          og_title: "test updated", 
          og_description: "test updated", 
          og_image: "test updated", 
          robots: "test updated", 
          schema_markup: "test updated", 
          hreflang: "test updated", 
          page_type: "test updated"
          }) {
          id
          title
          description
          keywords
          version
          canonical_url
          og_title
          og_description
          og_image
          robots
          schema_markup
          hreflang
          page_type
          }
        }
      `
      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: graphql })

      const errors = response.body
      console.log(JSON.stringify(errors, null, 2))
      const data = response.body.data.updateSeoMetadata

      expect(data.title).toBe('test updated')
      expect(data.description).toBe('test updated')
      expect(data.keywords).toBe('test updated')
      expect(data.version).toBe(2)
      expect(data.canonical_url).toBe('test updated')
      expect(data.og_title).toBe('test updated')
      expect(data.og_description).toBe('test updated')
      expect(data.og_image).toBe('test updated')
      expect(data.robots).toBe('test updated')
      expect(data.schema_markup).toBe('test updated')
      expect(data.hreflang).toBe('test updated')
      expect(data.page_type).toBe('test updated')
    })
    it('should return not found message if no metadata exists to update', async () => {
      const graphql = `
      mutation UpdateSeoMetadata {
        updateSeoMetadata(
            id: "no-existing-id"
            input: { title: "qwewqe", description: "qweqwe", keywords: "qwewqe", version: 1 }
        ) {
            id
            title
            description
            keywords
            version
            canonical_url
            og_title
            og_description
            og_image
            robots
            schema_markup
            hreflang
            page_type
            created_at
            updated_at
        }
      }
     `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: graphql })

      const errors = response.body.errors

      expect(errors[0].message).toBe('SeoMetadata not found to update!')
    })
    it('should throw domain validation error if title is empty or not valid', async () => {
      const existingSeoMetadata = await dbService.seoMetadata.create({
        data: {
          title: 'test',
          description: 'test',
          keywords: 'test',
          version: 1,
          canonical_url: 'test',
          og_title: 'test',
          og_description: 'test',
          og_image: 'test',
          robots: 'test',
          schema_markup: 'test',
          hreflang: 'test',
          page_type: 'test',
          channels: {
            connect: {
              code: 'default',
            },
          },
        },
      })

      const graphql = `
        mutation UpdateSeoMetadata {
          updateSeoMetadata(
              id: "${existingSeoMetadata.id}"
              input: { title: "", description: "qweqwe", keywords: "qwewqe", version: 1 }
          ) {
              id
              title
              description
              keywords
              version
              canonical_url
              og_title
              og_description
              og_image
              robots
              schema_markup
              hreflang
              page_type
              created_at
              updated_at
          }
        }
       `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: graphql })

      const errors = response.body.errors

      expect(errors[0].message).toBe('Validation failed for SeoMetadata')
    })
  })

  describe('removeSeoMetadataById', () => {
    it('should remove seo metadata', async () => {
      const md = await dbService.seoMetadata.create({
        data: {
          title: 'test',
          description: 'test',
          keywords: 'test',
          version: 1,
          canonical_url: 'test',
          og_title: 'test',
          og_description: 'test',
          og_image: 'test',
          robots: 'test',
          schema_markup: 'test',
          hreflang: 'test',
          page_type: 'test',
          channels: {
            connect: {
              code: 'default',
            },
          },
        },
      })

      const graphql = `
        mutation RemoveSeoMetadataById {
            removeSeoMetadataById(input: { id: "${md.id}" }) {
                id
                title
                description
                keywords
                version
                canonical_url
                og_title
                og_description
                og_image
                robots
                schema_markup
                hreflang
                page_type
                created_at
                updated_at
            }
        }
      `
      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: graphql })

      const data = response.body.data.removeSeoMetadataById

      expect(response.body.errors).toBeUndefined()
      expect(data.title).toBe('test')
      expect(data.description).toBe('test')
      expect(data.keywords).toBe('test')
      expect(data.version).toBe(1)
      expect(data.canonical_url).toBe('test')
      expect(data.og_title).toBe('test')
      expect(data.og_description).toBe('test')
      expect(data.og_image).toBe('test')
      expect(data.robots).toBe('test')
      expect(data.schema_markup).toBe('test')
      expect(data.hreflang).toBe('test')
      expect(data.page_type).toBe('test')
    })
    it('should return not found message if seo metadata not exists to delete', async () => {
      const graphql = `
        mutation RemoveSeoMetadataById {
            removeSeoMetadataById(input: { id: "no-existing-id" }) {
                id
                title
                description
                keywords
                version
                canonical_url
                og_title
                og_description
                og_image
                robots
                schema_markup
                hreflang
                page_type
                created_at
                updated_at
            }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: graphql })

      const errors = response.body.errors

      expect(errors[0].message).toBe('SeoMetadata not found to delete!')
    })
  })

  describe('findOneSeoMetadata', () => {
    it('should return seo metadata successfully', async () => {
      const md = await dbService.seoMetadata.create({
        data: {
          title: 'test',
          description: 'test',
          keywords: 'test',
          version: 1,
          channels: {
            connect: {
              code: 'default',
            },
          },
        },
      })

      const graphql = `
        query FindSeoMetadataById {
            findSeoMetadataById(input: { id: "${md.id}" }) {
                id
                title
                description
                keywords
                version
                canonical_url
                og_title
                og_description
                og_image
                robots
                schema_markup
                hreflang
                page_type
                created_at
                updated_at
            }
        }
    `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: graphql })

      const data = response.body.data.findSeoMetadataById

      expect(data.title).toBe('test')
      expect(data.description).toBe('test')
      expect(data.keywords).toBe('test')
      expect(data.version).toBe(1)
      expect(data.canonical_url).toBeNull()
      expect(data.og_title).toBeNull()
      expect(data.og_description).toBeNull()
      expect(data.og_image).toBeNull()
      expect(data.robots).toBeNull()
      expect(data.schema_markup).toBeNull()
      expect(data.hreflang).toBeNull()
    })
    it('should return seo null if no record exists', async () => {
      const graphql = `
        query FindSeoMetadataById {
            findSeoMetadataById(input: { id: "no-existing-id" }) {
                id
                title
                description
                keywords
                version
                canonical_url
                og_title
                og_description
                og_image
                robots
                schema_markup
                hreflang
                page_type
                created_at
                updated_at
            }
        }
        `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: graphql })

      const data = response.body.data.findSeoMetadataById

      expect(data).toBeNull()
    })
  })

  describe('findSeoMetadataList', () => {
    it('should return seo metadata list with pagination', async () => {
      await dbService.seoMetadata.create({
        data: {
          title: 'test',
          description: 'test',
          keywords: 'test',
          version: 1,
          channels: {
            connect: {
              code: 'default',
            },
          },
        },
      })

      await dbService.seoMetadata.create({
        data: {
          title: 'test 2',
          description: 'test 2',
          keywords: 'test 2',
          version: 2,
          channels: {
            connect: {
              code: 'default',
            },
          },
        },
      })

      const graphql = `
           query SeoMetadataList {
            seoMetadataList {
                items {
                    id
                    title
                    description
                    keywords
                    version
                    canonical_url
                    og_title
                    og_description
                    og_image
                    robots
                    schema_markup
                    hreflang
                    page_type
                    created_at
                    updated_at
                }
            }
        }

    `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: graphql })

      const data = response.body.data.seoMetadataList

      expect(data.items[0].title).toBe('test')
      expect(data.items[0].description).toBe('test')
      expect(data.items[0].keywords).toBe('test')
      expect(data.items[0].version).toBe(1)
      expect(data.items[0].canonical_url).toBeNull()
      expect(data.items[0].og_title).toBeNull()
      expect(data.items[0].og_description).toBeNull()
      expect(data.items[0].og_image).toBeNull()
      expect(data.items[0].robots).toBeNull()
      expect(data.items[0].schema_markup).toBeNull()
      expect(data.items[0].hreflang).toBeNull()

      expect(data.items[1].title).toBe('test 2')
      expect(data.items[1].description).toBe('test 2')
      expect(data.items[1].keywords).toBe('test 2')
      expect(data.items[1].version).toBe(2)
      expect(data.items[1].canonical_url).toBeNull()
      expect(data.items[1].og_title).toBeNull()
      expect(data.items[1].og_description).toBeNull()
      expect(data.items[1].og_image).toBeNull()
      expect(data.items[1].robots).toBeNull()
      expect(data.items[1].schema_markup).toBeNull()
      expect(data.items[1].hreflang).toBeNull()
    })

    it('should return proper length with proper pagination limits', async () => {
      await Promise.all([
        dbService.seoMetadata.create({
          data: {
            title: 'test',
            description: 'test',
            keywords: 'test',
            version: 1,
            channels: {
              connect: {
                code: 'default',
              },
            },
          },
        }),
        dbService.seoMetadata.create({
          data: {
            title: 'test 2',
            description: 'test 2',
            keywords: 'test 2',
            version: 2,
            channels: {
              connect: {
                code: 'default',
              },
            },
          },
        }),
      ])

      const graphql = (limit: number, position: number) => `
            query SeoMetadataList {
                seoMetadataList(input: { limit: ${limit}, position: ${position} }) {
                    items {
                        id
                        title
                        description
                        keywords
                        version
                        canonical_url
                        og_title
                        og_description
                        og_image
                        robots
                        schema_markup
                        hreflang
                        page_type
                        created_at
                        updated_at
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
        .send({ query: graphql(1, 0) })

      const data = response.body.data.seoMetadataList

      expect(data.items).toHaveLength(1)
      expect(data.pagination.total).toBe(2)
      expect(data.pagination.limit).toBe(1)
      expect(data.pagination.position).toBe(0)

      const response2 = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: graphql(1, 1) })

      const data2 = response2.body.data.seoMetadataList

      expect(data2.items).toHaveLength(1)
      expect(data2.pagination.total).toBe(2)
      expect(data2.pagination.limit).toBe(1)
      expect(data2.pagination.position).toBe(1)
    })
  })
})
