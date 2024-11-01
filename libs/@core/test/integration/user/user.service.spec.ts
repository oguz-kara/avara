import { ConflictException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { DbService } from '@avara/shared/database/db-service'
import { RoleRepository } from '@avara/core/modules/user/infrastructure/orm/repository/role.repository'
import { RoleMapper } from '@avara/core/modules/user/infrastructure/mappers/role.mapper'
import { PermissionMapper } from '@avara/core/modules/user/infrastructure/mappers/permission.mapper'
import { RolePermissionMapper } from '@avara/core/modules/user/infrastructure/mappers/role-permission.mapper'
import { RolePermissionRepository } from '@avara/core/modules/user/infrastructure/orm/repository/role-permission.repository'
import { UserService } from '@avara/core/modules/user/application/services/user.service'
import { UserRepository } from '@avara/core/modules/user/infrastructure/orm/repository/user.repository'
import { UserMapper } from '@avara/core/modules/user/infrastructure/mappers/user.mapper'
import {
  AssignRoleInput,
  CreateUserDto,
} from '@avara/core/modules/user/application/graphql/dto/user.dto'
import { UserActiveStatus } from '@avara/core/modules/user/domain/enums/user-active-status.enum'
import { User } from '@avara/core/modules/user/domain/entities/user.entity'

describe('UserService (Integration)', () => {
  let userService: UserService
  let dbService: DbService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserRepository,
        RoleRepository,
        DbService,
        UserMapper,
        RoleMapper,
        RolePermissionRepository,
        PermissionMapper,
        RolePermissionMapper,
      ],
    }).compile()

    userService = module.get<UserService>(UserService)
    dbService = module.get<DbService>(DbService)

    // Clear database
    await dbService.user.deleteMany()
    await dbService.role.deleteMany()
  })

  afterAll(async () => {
    await dbService.user.deleteMany()
    await dbService.$disconnect()
  })

  beforeEach(async () => {
    await dbService.user.deleteMany()
    await dbService.role.deleteMany()
  })

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const role = await dbService.role.create({
        data: { name: 'User' },
      })
      const input: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        role_id: role.id,
        email_verified: false,
        is_active: UserActiveStatus.ACTIVE,
      }

      const result = await userService.addNewUser(input)

      expect(result).toBeTruthy()
      expect(result.email).toBe(input.email)
      expect(result.role_id).toBe(input.role_id)
      expect(result.email_verified).toBe(input.email_verified)
      expect(result.is_active).toBe(input.is_active)

      const savedUser = await dbService.user.findUnique({
        where: { id: result.id },
      })
      expect(savedUser).toBeTruthy()
      expect(savedUser?.email).toBe(input.email)
      expect(savedUser?.role_id).toBe(input.role_id)
      expect(savedUser?.email_verified).toBe(input.email_verified)
      expect(savedUser?.is_active).toBe(input.is_active)
    })

    it('should throw ConflictException if email already exists', async () => {
      const role = await dbService.role.create({
        data: { name: 'User' },
      })
      const input: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
        role_id: role.id,
        email_verified: false,
        is_active: UserActiveStatus.ACTIVE,
      }

      await userService.addNewUser(input)

      await expect(userService.addNewUser(input)).rejects.toThrow(
        ConflictException,
      )
    })
  })

  describe('assignRole', () => {
    it('should assign a role to a user successfully', async () => {
      const role = await dbService.role.create({
        data: {
          name: 'old-role',
        },
      })

      const user = await dbService.user.create({
        data: {
          email: 'test@example.com',
          password_hash: 'password123',
          role_id: role.id,
          email_verified: false,
          is_active: 'ACTIVE',
        },
      })

      const newRole = await dbService.role.create({
        data: { name: 'NewRole' },
      })

      const input: AssignRoleInput = {
        userId: user.id,
        roleId: newRole.id,
      }

      const result = await userService.assignUserRole(
        input.userId,
        input.roleId,
      )

      expect(result).toBeTruthy()
      expect(result.role_id).toBe(input.roleId)

      const updatedUser = await dbService.user.findUnique({
        where: { id: user.id },
      })

      expect(updatedUser).toBeTruthy()
      expect(updatedUser?.role_id).toBe(input.roleId)
    })

    it('should throw NotFoundException if user not found', async () => {
      const role = await dbService.role.create({
        data: { name: 'NewRole' },
      })
      const input: AssignRoleInput = {
        userId: 'non-existent-user-id',
        roleId: role.id,
      }

      await expect(
        userService.assignUserRole(input.userId, input.roleId),
      ).rejects.toThrow(NotFoundException)
    })

    it('should throw NotFoundException if role not found', async () => {
      const role = await dbService.role.create({
        data: { name: 'NewRole' },
      })

      const user = await dbService.user.create({
        data: {
          email: 'test@example.com',
          password_hash: 'password123',
          role_id: role.id,
          email_verified: false,
          is_active: 'ACTIVE',
        },
      })

      const input: AssignRoleInput = {
        userId: user.id,
        roleId: 'non-existent-role-id',
      }

      await expect(
        userService.assignUserRole(input.userId, input.roleId),
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('findById', () => {
    it('should find a user by id successfully', async () => {
      const role = await dbService.role.create({
        data: { name: 'NewRole' },
      })

      const user = await dbService.user.create({
        data: {
          email: 'test@example.com',
          password_hash: 'password123',
          role_id: role.id,
          email_verified: false,
          is_active: 'ACTIVE',
        },
      })

      const result = await userService.retrieveUserById(user.id)

      expect(result).toBeTruthy()
      expect(result.id).toBe(user.id)
      expect(result.email).toBe(user.email)
      expect(result.role_id).toBe(user.role_id)
      expect(result.email_verified).toBe(user.email_verified)
      expect(result.is_active).toBe(user.is_active)
    })

    it('should return null if user not found', async () => {
      const result = await userService.retrieveUserById('non-existent-id')

      expect(result).toBeNull()
    })
  })

  describe('findByEmail', () => {
    it('should find a user by email successfully', async () => {
      const role = await dbService.role.create({
        data: {
          name: 'test-role',
        },
      })

      const user = await dbService.user.create({
        data: {
          email: 'test@example.com',
          password_hash: 'password123',
          role_id: role.id,
          email_verified: false,
          is_active: 'ACTIVE',
        },
      })

      const result = await userService.retrieveUserByEmail(user.email)

      expect(result).toBeTruthy()
      expect(result.id).toBe(user.id)
      expect(result.email).toBe(user.email)
      expect(result.role_id).toBe(user.role_id)
      expect(result.email_verified).toBe(user.email_verified)
      expect(result.is_active).toBe(user.is_active)
    })

    it('should return null if user not found', async () => {
      const result = await userService.retrieveUserByEmail(
        'non-existent-email@example.com',
      )

      expect(result).toBeNull()
    })
  })

  describe('findMany', () => {
    it('should retrieve all users with pagination', async () => {
      const role = await dbService.role.create({
        data: {
          name: 'test-role',
        },
      })
      await dbService.user.create({
        data: {
          email: 'user1@example.com',
          password_hash: 'password123',
          role_id: role.id,
          email_verified: false,
          is_active: 'ACTIVE',
        },
      })
      await dbService.user.create({
        data: {
          email: 'user2@example.com',
          password_hash: 'password123',
          role_id: role.id,
          email_verified: false,
          is_active: 'ACTIVE',
        },
      })

      const paginationParams = { limit: 10, position: 0 }
      const paginatedResponse = {
        items: [
          new User({
            id: '1',
            email: 'user1@example.com',
            password_hash: 'password123',
            role_id: 'role-id',
            email_verified: false,
            is_active: UserActiveStatus.ACTIVE,
          }),
          new User({
            id: '2',
            email: 'user2@example.com',
            password_hash: 'password123',
            role_id: 'role-id',
            email_verified: false,
            is_active: UserActiveStatus.ACTIVE,
          }),
        ],
        pagination: { total: 2, limit: 10, position: 0 },
      }

      jest
        .spyOn(UserRepository.prototype, 'findAll')
        .mockResolvedValue(paginatedResponse)

      const result = await userService.retrievePaginatedUsers(paginationParams)

      expect(result).toBe(paginatedResponse)
      expect(UserRepository.prototype.findAll).toHaveBeenCalledWith(
        paginationParams,
      )
    })
  })
})
