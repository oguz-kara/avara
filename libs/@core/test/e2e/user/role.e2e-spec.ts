import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../../../../../src/app.module'
import { DbService } from '@avara/shared/database/db-service'

describe('RoleResolver (e2e)', () => {
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
    await dbService.role.deleteMany()
  })

  describe('createRole', () => {
    it('should create a new role successfully', async () => {
      const createRoleMutation = `
        mutation {
          createRole(input: { name: "Admin" }) {
            id
            name
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: createRoleMutation })

      expect(response.status).toBe(200)
      expect(response.body.data.createRole).toBeTruthy()
      expect(response.body.data.createRole.name).toBe('Admin')

      const savedRole = await dbService.role.findUnique({
        where: { id: response.body.data.createRole.id },
      })
      expect(savedRole).toBeTruthy()
      expect(savedRole?.name).toBe('Admin')
    })

    it('should throw ConflictException if role name already exists', async () => {
      await dbService.role.create({
        data: { name: 'Admin' },
      })

      const createRoleMutation = `
        mutation {
          createRole(input: { name: "Admin" }) {
            id
            name
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: createRoleMutation })

      expect(response.status).toBe(200)
      expect(response.body.errors).toBeTruthy()
      expect(response.body.errors[0].message).toContain('Role already exists!')
    })
  })

  describe('renameRoleById', () => {
    it('should rename a role successfully', async () => {
      const role = await dbService.role.create({
        data: { name: 'OldName' },
      })

      const renameRoleMutation = `
        mutation {
          renameRoleById(input: { id: "${role.id}", name: "NewName" }) {
            id
            name
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: renameRoleMutation })

      expect(response.status).toBe(200)
      expect(response.body.data.renameRoleById).toBeTruthy()
      expect(response.body.data.renameRoleById.name).toBe('NewName')

      const renamedRole = await dbService.role.findUnique({
        where: { id: role.id },
      })
      expect(renamedRole).toBeTruthy()
      expect(renamedRole?.name).toBe('NewName')
    })

    it('should throw ConflictException if role name already exists', async () => {
      await dbService.role.create({
        data: { name: 'NewName' },
      })
      const role = await dbService.role.create({
        data: { name: 'OldName' },
      })

      const renameRoleMutation = `
        mutation {
          renameRoleById(input: { id: "${role.id}", name: "NewName" }) {
            id
            name
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: renameRoleMutation })

      expect(response.status).toBe(200)
      expect(response.body.errors).toBeTruthy()
      expect(response.body.errors[0].message).toContain('Role already exists!')
    })
  })

  describe('findRoleById', () => {
    it('should find a role by id successfully', async () => {
      const role = await dbService.role.create({
        data: { name: 'Admin' },
      })

      const findRoleByIdQuery = `
        query {
          findRoleById(input: { id: "${role.id}" }) {
            id
            name
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: findRoleByIdQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.findRoleById).toBeTruthy()
      expect(response.body.data.findRoleById.id).toBe(role.id)
      expect(response.body.data.findRoleById.name).toBe(role.name)
    })

    it('should return null if role not found', async () => {
      const findRoleByIdQuery = `
        query {
          findRoleById(input: { id: "non-existent-id" }) {
            id
            name
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: findRoleByIdQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.findRoleById).toBeNull()
    })
  })

  describe('findRoleByName', () => {
    it('should find a role by name successfully', async () => {
      const role = await dbService.role.create({
        data: { name: 'Admin' },
      })

      const findRoleByNameQuery = `
        query {
          findRoleByName(input: { name: "Admin" }) {
            id
            name
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: findRoleByNameQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.findRoleByName).toBeTruthy()
      expect(response.body.data.findRoleByName.id).toBe(role.id)
      expect(response.body.data.findRoleByName.name).toBe(role.name)
    })

    it('should return null if role not found', async () => {
      const findRoleByNameQuery = `
        query {
          findRoleByName(input: { name: "non-existent-name" }) {
            id
            name
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: findRoleByNameQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.findRoleByName).toBeNull()
    })
  })

  describe('findRoles', () => {
    it('should retrieve all roles with pagination', async () => {
      await dbService.role.create({
        data: { name: 'Role1' },
      })
      await dbService.role.create({
        data: { name: 'Role2' },
      })
      await dbService.role.create({
        data: { name: 'Role3' },
      })

      const findRolesQuery = `
        query {
          findRoles(input: { limit: 10, position: 0 }) {
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
        .post('/graphql')
        .send({ query: findRolesQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.findRoles.items).toHaveLength(3)
      expect(response.body.data.findRoles.items.map((r) => r.name)).toEqual(
        expect.arrayContaining(['Role1', 'Role2', 'Role3']),
      )
      expect(response.body.data.findRoles.pagination).toEqual({
        total: 3,
        limit: 10,
        position: 0,
      })
    })

    it('should return an empty array when no roles exist', async () => {
      const findRolesQuery = `
        query {
          findRoles(input: { limit: 10, position: 0 }) {
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
        .post('/graphql')
        .send({ query: findRolesQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.findRoles.items).toEqual([])
    })
  })

  describe('removeRoleById', () => {
    it('should remove a role successfully by role ID', async () => {
      const role = await dbService.role.create({
        data: { name: 'Role1' },
      })

      const removeRoleByIdMutation = `
        mutation {
          removeRoleById(input: { id: "${role.id}" }) {
            id
            name
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: removeRoleByIdMutation })

      expect(response.status).toBe(200)
      expect(response.body.data.removeRoleById).toBeTruthy()
      expect(response.body.data.removeRoleById.id).toBe(role.id)

      const removedRole = await dbService.role.findUnique({
        where: { id: role.id },
      })
      expect(removedRole).toBeNull()
    })

    it('should throw a ConflictException if no role exists to remove', async () => {
      const removeRoleByIdMutation = `
        mutation {
          removeRoleById(input: { id: "non-existent-id" }) {
            id
            name
          }
        }
      `

      const response = await request(app.getHttpServer())
        .post('/graphql')
        .send({ query: removeRoleByIdMutation })

      expect(response.status).toBe(200)
      expect(response.body.errors).toBeTruthy()
      expect(response.body.errors[0].message).toContain(
        'Role not found to remove!',
      )
    })
  })
})
