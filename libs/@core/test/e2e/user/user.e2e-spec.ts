import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../../../../../src/app.module'
import { DbService } from '@avara/shared/database/db-service'
import { UserActiveStatus } from '@avara/core/modules/user/domain/enums/user-active-status.enum'
import { createRoleByRequest } from '../helpers/create-role-by-request'

describe('UserResolver (e2e)', () => {
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
    await dbService.user.deleteMany()
    await dbService.role.deleteMany()
  })

  describe('createUser', () => {
    it.only('should create new user successfully', async () => {
      const role = await createRoleByRequest(request, app)

      expect(role).toBeTruthy()

      const createUserMutation = `
      mutation {
          createUser(input: { email: "hasankara@gmail.com", password: "hasankara123", role_id: "${role.id}", email_verified: true, is_active: ACTIVE }) {
              id
              email
              role_id 
          }
      }
  `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: createUserMutation })

      expect(response.status).toBe(200)
      expect(response.body.data.createUser).toBeTruthy()
      expect(response.body.data.createUser.email).toBe('hasankara@gmail.com')

      const savedUser = await dbService.user.findUnique({
        where: { id: response.body.data.createUser.id },
      })

      expect(savedUser).toBeTruthy()
      expect(savedUser.email).toBe('hasankara@gmail.com')
      expect(savedUser.role_id).toBe(role.id)
      expect(savedUser.email_verified).toBe(true)
      expect(savedUser.is_active).toBe(UserActiveStatus.ACTIVE)
    })

    it('should throw Conflict error if user already exists', async () => {
      const role = await createRoleByRequest(request, app)

      expect(role).toBeTruthy()

      const createUserMutation = `
      mutation {
          createUser(input: { email: "hasan@gmail.com", password: "hasankara123", role_id: "${role.id}", email_verified: true, is_active: ACTIVE }) {
              id
              email
              role_id 
          }
      }
  `

      await dbService.user.create({
        data: {
          email: 'hasan@gmail.com',
          password_hash: 'test123123123',
          is_active: UserActiveStatus.ACTIVE,
          email_verified: true,
          role_id: role.id,
        },
      })

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: createUserMutation })

      const errors = response.body.errors

      expect(response.status).toBe(200)
      expect(errors).toBeTruthy()
      expect(errors[0].message).toContain('User already exists!')
    })

    it('should throw NotFound error if role not exists', async () => {
      const createUserMutation = `
        mutation {
            createUser(input: { email: "hasan@gmail.com", password: "hasankara123", role_id: "non-existin-role-id", email_verified: true, is_active: ACTIVE }) {
                id
                email
                role_id 
            }
        }
    `

      const response = await request(app.getHttpServer())
        .post('/protected')
        .send({ query: createUserMutation })

      const errors = response.body.errors

      expect(response.status).toBe(200)
      expect(errors).toBeTruthy()
      expect(errors[0].message).toContain('User role not found to assign!')
    })
  })
})
