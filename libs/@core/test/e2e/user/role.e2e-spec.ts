import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../../../../../src/app.module'
import { DbService } from '@avara/shared/database/db-service'
import { RoleRepository } from '@avara/core/modules/user/infrastructure/orm/repository/role.repository'

describe('RoleResolver (e2e)', () => {
  let app: INestApplication
  let dbService: DbService
  let repo: RoleRepository

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    dbService = moduleFixture.get<DbService>(DbService)
    repo = moduleFixture.get<RoleRepository>(RoleRepository)
  })

  afterAll(async () => {
    await dbService.$disconnect()
    await app.close()
  })

  beforeEach(async () => {
    await dbService.user.deleteMany()
    await dbService.rolePermission.deleteMany()
    await dbService.role.deleteMany()
    await dbService.permission.deleteMany()
    await dbService.channel.deleteMany()
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
        .post('/protected')
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
        .post('/protected')
        .send({ query: createRoleMutation })

      expect(response.status).toBe(200)
      expect(response.body.errors).toBeTruthy()
      expect(response.body.errors[0].message).toContain('Role already exists!')
    })

    it('should create a role for a specific channel', async () => {
      const newChannel = await dbService.channel.create({
        data: {
          name: 'test-channel',
          code: 'test-channel-code',
          default_language_code: 'en',
          currency_code: 'USD',
          is_default: false,
        },
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
        .post('/protected')
        .set('x-channel-id', newChannel.id)
        .set('x-channel-code', newChannel.code)
        .set('x-language-code', 'en')
        .set('x-curreny-code', 'USD')
        .send({ query: createRoleMutation })

      const role = await repo.findOneByNameInChannel('Admin')

      const channels = role.channels
      const channel = channels[0]

      expect(response.status).toBe(200)
      expect(response.body.data.createRole).toBeTruthy()
      expect(response.body.data.createRole.name).toBe('Admin')
      expect(channels).toHaveLength(1)
      expect(channel.name).toBe('test-channel')
      expect(channel.code).toBe('test-channel-code')

      const savedRole = await dbService.role.findUnique({
        where: { id: response.body.data.createRole.id },
        include: { channels: true },
      })

      expect(savedRole).toBeTruthy()
      expect(savedRole?.name).toBe('Admin')
      expect(savedRole?.channels[0].id).toBe(channel.id)
      expect(savedRole?.channels[0].name).toBe('test-channel')
      expect(savedRole?.channels[0].code).toBe('test-channel-code')
    })

    it('should create a role with permissions', async () => {})
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
        .post('/protected')
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
        .post('/protected')
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
        .post('/protected')
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
        .post('/protected')
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
        .post('/protected')
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
        .post('/protected')
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
          roles(input: { limit: 10, position: 0 }) {
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
        .send({ query: findRolesQuery })

      console.log({ errors: response.body.errors })

      expect(response.status).toBe(200)
      expect(response.body.data.roles.items).toHaveLength(3)
      expect(response.body.data.roles.items.map((r) => r.name)).toEqual(
        expect.arrayContaining(['Role1', 'Role2', 'Role3']),
      )
      expect(response.body.data.roles.pagination).toEqual({
        total: 3,
        limit: 10,
        position: 0,
      })
    })

    it('should return an empty array when no roles exist', async () => {
      const findRolesQuery = `
        query {
          roles(input: { limit: 10, position: 0 }) {
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
        .send({ query: findRolesQuery })

      expect(response.status).toBe(200)
      expect(response.body.data.roles.items).toEqual([])
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
        .post('/protected')
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
        .post('/protected')
        .send({ query: removeRoleByIdMutation })

      expect(response.status).toBe(200)
      expect(response.body.errors).toBeTruthy()
      expect(response.body.errors[0].message).toContain(
        'Role not found to remove!',
      )
    })
  })
})
