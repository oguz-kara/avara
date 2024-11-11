import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { DbService } from '@avara/shared/database/db-service'
import { AppModule } from 'src/app.module'

describe('PermissionResolver (e2e)', () => {
  let app: INestApplication
  let dbService: DbService

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    dbService = moduleFixture.get<DbService>(DbService)

    await dbService.permission.deleteMany()
  })

  afterAll(async () => {
    await dbService.$disconnect()
    await app.close()
  })

  beforeEach(async () => {
    await dbService.permission.deleteMany()
  })

  describe('createPermission', () => {
    it('should create a new permission successfully', async () => {
      const createPermissionMutation = `
        mutation {
          createPermission(input: { action: READ, resource: USER, scope: GLOBAL }) {
            id
            name
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: createPermissionMutation })

      expect(response.status).toBe(200)
      expect(response.body.data.createPermission).toBeTruthy()
      expect(response.body.data.createPermission.name).toBe('READ:USER:GLOBAL')

      const savedPermission = await dbService.permission.findUnique({
        where: { id: response.body.data.createPermission.id },
      })

      expect(savedPermission).toBeTruthy()
      expect(savedPermission?.action).toBe('READ')
      expect(savedPermission?.resource).toBe('USER')
      expect(savedPermission?.scope).toBe('GLOBAL')
    })

    it('should throw ConflictException if permission already exists', async () => {
      await dbService.permission.create({
        data: { action: 'READ', resource: 'USER', scope: 'GLOBAL' },
      })

      const createPermissionMutation = `
        mutation {
          createPermission(input: { action: READ, resource: USER, scope: GLOBAL }) {
            id
            name
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: createPermissionMutation })

      expect(response.status).toBe(200)
      expect(response.body.errors).toBeTruthy()
      expect(response.body.errors[0].message).toContain(
        'Permission already exists!',
      )
    })
  })

  describe('findPermissionById', () => {
    it('should find a permission by id successfully', async () => {
      const permission = await dbService.permission.create({
        data: { action: 'READ', resource: 'USER', scope: 'GLOBAL' },
      })

      const findPermissionByIdQuery = `
        query {
          findPermissionById(input: { id: "${permission.id}" }) {
            id
            name
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: findPermissionByIdQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.findPermissionById).toBeTruthy()
      expect(response.body.data.findPermissionById.id).toBe(permission.id)
      expect(response.body.data.findPermissionById.name).toBe(
        `${permission.action}:${permission.resource}:${permission.scope}`,
      )
    })

    it('should return null if permission not found', async () => {
      const findPermissionByIdQuery = `
        query {
          findPermissionById(input: { id: "non-existent-id" }) {
            id
            name
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: findPermissionByIdQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.findPermissionById).toBeNull()
    })
  })

  describe('findPermissionByName', () => {
    it('should find a permission by name successfully', async () => {
      const permission = await dbService.permission.create({
        data: { action: 'READ', resource: 'USER', scope: 'GLOBAL' },
      })
      const name = `${permission.action}:${permission.resource}:${permission.scope}`

      const findPermissionByNameQuery = `
        query {
          findPermissionByName(input: { name: "${name}" }) {
            id
            action
            resource
            scope
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: findPermissionByNameQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.findPermissionByName).toBeTruthy()
      expect(response.body.data.findPermissionByName.id).toBe(permission.id)
      expect(response.body.data.findPermissionByName.action).toBe(
        permission.action,
      )
      expect(response.body.data.findPermissionByName.resource).toBe(
        permission.resource,
      )
      expect(response.body.data.findPermissionByName.scope).toBe(
        permission.scope,
      )
    })

    it('should return null if permission not found', async () => {
      const findPermissionByNameQuery = `
        query {
          findPermissionByName(input: { name: "READ:USER:GLOBAL" }) {
            id
            action
            resource
            scope
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: findPermissionByNameQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.findPermissionByName).toBeNull()
    })
  })

  describe('findPermissions', () => {
    it('should retrieve all permissions with pagination', async () => {
      await dbService.permission.create({
        data: { action: 'READ', resource: 'USER', scope: 'GLOBAL' },
      })
      await dbService.permission.create({
        data: { action: 'WRITE', resource: 'USER', scope: 'GLOBAL' },
      })

      const findPermissionsQuery = `
        query {
          permissions(input: { limit: 10, position: 0 }) {
            items {
              id
              action
              resource
              scope
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
        .send({ query: findPermissionsQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.permissions.items).toHaveLength(2)
      expect(response.body.data.permissions.items.map((p) => p.action)).toEqual(
        expect.arrayContaining(['READ', 'WRITE']),
      )
      expect(response.body.data.permissions.pagination).toEqual({
        total: 2,
        limit: 10,
        position: 0,
      })
    })

    it('should return an empty array when no permissions exist', async () => {
      const findPermissionsQuery = `
        query {
          permissions(input: { limit: 10, position: 0 }) {
            items {
              id
              action
              resource
              scope
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
        .send({ query: findPermissionsQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.permissions.items).toEqual([])
    })
  })

  describe('removePermissionById', () => {
    it('should remove a permission successfully by permission ID', async () => {
      const permission = await dbService.permission.create({
        data: { action: 'READ', resource: 'USER', scope: 'GLOBAL' },
      })

      const removePermissionByIdMutation = `
        mutation {
          removePermissionById(input: { id: "${permission.id}" }) {
            id
            action
            resource
            scope
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: removePermissionByIdMutation })

      expect(response.status).toBe(200)
      expect(response.body.data.removePermissionById).toBeTruthy()
      expect(response.body.data.removePermissionById.id).toBe(permission.id)

      const removedPermission = await dbService.permission.findUnique({
        where: { id: permission.id },
      })
      expect(removedPermission).toBeNull()
    })

    it('should throw a ConflictException if no permission exists to remove', async () => {
      const removePermissionByIdMutation = `
        mutation {
          removePermissionById(input: { id: "non-existent-id" }) {
            id
            action
            resource
            scope
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: removePermissionByIdMutation })

      expect(response.status).toBe(200)
      expect(response.body.errors).toBeTruthy()
      expect(response.body.errors[0].message).toContain('Permission not found!')
    })
  })
})
