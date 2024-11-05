import { ConfigModule, ConfigService } from '@nestjs/config'
import { ConflictException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PermissionService } from '@avara/core/modules/user/application/services/permission.service'
import { DbService } from '@avara/shared/database/db-service'
import { PermissionRepository } from '@avara/core/modules/user/infrastructure/orm/repository/permission.repository'
import { PermissionMapper } from '@avara/core/modules/user/infrastructure/mappers/permission.mapper'
import { PaginationUtils } from '@avara/shared/utils/pagination.util'
import { appConfig } from '@avara/core/modules/user/config/app.config'
import { CreatePermissionDto } from '@avara/core/modules/user/application/graphql/dto/permission.dto'
import {
  ActionType,
  ResourceType,
  ScopeType,
} from '@avara/core/modules/user/application/enums'
import { PermissionString } from '@avara/core/modules/user/api/types/permission.types'

describe('PermissionService (Integration)', () => {
  let permissionService: PermissionService
  let dbService: DbService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig],
        }),
      ],
      providers: [
        PermissionService,
        PermissionRepository,
        DbService,
        PermissionMapper,
        PaginationUtils,
        ConfigService,
      ],
    }).compile()

    dbService = module.get<DbService>(DbService)
    permissionService = module.get<PermissionService>(PermissionService)
  })

  beforeEach(async () => {
    await dbService.$transaction([
      dbService.rolePermission.deleteMany(),
      dbService.permission.deleteMany(),
      dbService.user.deleteMany(),
      dbService.role.deleteMany(),
    ])
  })

  afterAll(async () => {
    await dbService.$transaction([
      dbService.rolePermission.deleteMany(),
      dbService.permission.deleteMany(),
      dbService.user.deleteMany(),
      dbService.role.deleteMany(),
    ])
  })

  describe('createPermission', () => {
    it('should create a new permission successfully', async () => {
      const input: CreatePermissionDto = {
        action: ActionType.READ,
        resource: ResourceType.USER,
        scope: ScopeType.GLOBAL,
      }

      const result = await permissionService.createPermission(input)

      expect(result).toBeTruthy()
      expect(result.action).toBe(input.action)
      expect(result.resource).toBe(input.resource)
      expect(result.scope).toBe(input.scope)
    })

    it('should throw ConflictException if permission already exists', async () => {
      const input: CreatePermissionDto = {
        action: ActionType.READ,
        resource: ResourceType.USER,
        scope: ScopeType.GLOBAL,
      }

      await permissionService.createPermission(input)

      await expect(permissionService.createPermission(input)).rejects.toThrow(
        ConflictException,
      )
    })
  })

  describe('findById', () => {
    it('should find a permission by id successfully', async () => {
      const permission = await dbService.permission.create({
        data: {
          action: 'READ',
          resource: 'USER',
          scope: 'GLOBAL',
        },
      })

      const result = await permissionService.findById(permission.id)

      expect(result).toBeTruthy()
      expect(result.id).toBe(permission.id)
      expect(result.action).toBe(permission.action)
      expect(result.resource).toBe(permission.resource)
      expect(result.scope).toBe(permission.scope)
    })

    it('should return null if permission not found', async () => {
      const result = await permissionService.findById('non-existent-id')

      expect(result).toBeNull()
    })
  })

  describe('findByName', () => {
    it('should find a permission by name successfully', async () => {
      const permission = await dbService.permission.create({
        data: {
          action: 'READ',
          resource: 'USER',
          scope: 'GLOBAL',
        },
      })
      const name = `${permission.action}:${permission.resource}:${permission.scope}`

      const result = await permissionService.findByName(
        name as PermissionString,
      )

      expect(result).toBeTruthy()
      expect(result.id).toBe(permission.id)
      expect(result.action).toBe(permission.action)
      expect(result.resource).toBe(permission.resource)
      expect(result.scope).toBe(permission.scope)
    })

    it('should return null if permission not found', async () => {
      const result = await permissionService.findByName('READ:USER:GLOBAL')

      expect(result).toBeNull()
    })
  })

  describe('findMany', () => {
    it('should retrieve all permissions with pagination', async () => {
      await Promise.all([
        await dbService.permission.create({
          data: {
            action: 'READ',
            resource: 'USER',
            scope: 'GLOBAL',
          },
        }),
        await dbService.permission.create({
          data: {
            action: 'WRITE',
            resource: 'USER',
            scope: 'GLOBAL',
          },
        }),
      ])

      const paginationParams = { limit: 10, position: 0 }

      const result = await permissionService.findMany(paginationParams)

      expect(result.items).toHaveLength(2)
      expect(result.pagination.total).toBe(2)
      expect(result.pagination.limit).toBe(10)
      expect(result.pagination.position).toBe(0)
    })
  })
})
