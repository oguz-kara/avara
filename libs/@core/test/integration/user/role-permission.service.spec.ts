import { CreateRolePermissionDto } from '@avara/core/modules/user/application/graphql/dto/role-permission.dto'
import { RolePermissionService } from '@avara/core/modules/user/application/services/role-permission.service'
import { PaginationUtils } from '@avara/shared/utils/pagination.util'
import { appConfig } from '@avara/core/modules/user/config/app.config'
import { PermissionMapper } from '@avara/core/modules/user/infrastructure/mappers/permission.mapper'
import { RolePermissionMapper } from '@avara/core/modules/user/infrastructure/mappers/role-permission.mapper'
import { RoleMapper } from '@avara/core/modules/user/infrastructure/mappers/role.mapper'
import { RolePermissionRepository } from '@avara/core/modules/user/infrastructure/orm/repository/role-permission.repository'
import { DbService } from '@avara/shared/database/db-service'
import { ConflictException } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

describe('RolePermissionService (Integration)', () => {
  let rolePermissionService: RolePermissionService
  let dbService: DbService
  // let rolePermissionMapper: RolePermissionMapper

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig],
        }),
      ],
      providers: [
        RolePermissionService,
        RolePermissionRepository,
        RolePermissionMapper,
        PaginationUtils,
        PermissionMapper,
        ConfigService,
        RoleMapper,
        DbService,
      ],
    }).compile()

    dbService = module.get<DbService>(DbService)
    rolePermissionService = module.get<RolePermissionService>(
      RolePermissionService,
    )
    // rolePermissionMapper =
    //   module.get<RolePermissionMapper>(RolePermissionMapper)
  })

  beforeEach(async () => {
    await dbService.$transaction([
      dbService.rolePermission.deleteMany(),
      dbService.permission.deleteMany(),
      dbService.role.deleteMany(),
    ])
  })

  afterAll(async () => {
    await dbService.$transaction([
      dbService.rolePermission.deleteMany(),
      dbService.permission.deleteMany(),
      dbService.role.deleteMany(),
    ])
  })

  describe('createRolePermission', () => {
    it('should create a new role permission successfully', async () => {
      const role = await dbService.role.create({
        data: { name: 'Admin' },
      })
      const permission = await dbService.permission.create({
        data: { action: 'READ', resource: 'USER', scope: 'GLOBAL' },
      })

      const input: CreateRolePermissionDto = {
        role_id: role.id,
        permission_id: permission.id,
        is_active: true,
      }

      const result = await rolePermissionService.createRolePermission(input)

      expect(result).toBeTruthy()
      expect(result.role_id).toBe(input.role_id)
      expect(result.permission_id).toBe(input.permission_id)

      const savedRolePermission = await dbService.rolePermission.findUnique({
        where: { id: result.id },
      })
      expect(savedRolePermission).toBeTruthy()
      expect(savedRolePermission?.role_id).toBe(input.role_id)
      expect(savedRolePermission?.permission_id).toBe(input.permission_id)
    })

    it('should throw ConflictException if role permission already exists', async () => {
      const role = await dbService.role.create({
        data: { name: 'Admin' },
      })
      const permission = await dbService.permission.create({
        data: { action: 'READ', resource: 'USER', scope: 'GLOBAL' },
      })
      const input: CreateRolePermissionDto = {
        role_id: role.id,
        permission_id: permission.id,
        is_active: true,
      }

      await rolePermissionService.createRolePermission(input)

      await expect(
        rolePermissionService.createRolePermission(input),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('findById', () => {
    it('should find a role permission by id successfully', async () => {
      const role = await dbService.role.create({
        data: {
          name: 'Admin',
        },
      })

      const permission = await dbService.permission.create({
        data: {
          action: 'ALL',
          resource: 'ARTICLE',
          scope: 'GLOBAL',
        },
      })

      const rolePermission = await dbService.rolePermission.create({
        data: {
          role_id: role.id,
          permission_id: permission.id,
        },
      })

      const result = await rolePermissionService.findById(rolePermission.id)

      expect(result).toBeTruthy()
      expect(result.id).toBe(rolePermission.id)
      expect(result.role_id).toBe(rolePermission.role_id)
      expect(result.permission_id).toBe(rolePermission.permission_id)
    })

    it('should return null if role permission not found', async () => {
      const result = await rolePermissionService.findById('non-existent-id')

      expect(result).toBeNull()
    })
  })

  describe('findMany', () => {
    it('should retrieve all role permissions with pagination', async () => {
      const roles = await Promise.all([
        dbService.role.create({
          data: {
            name: 'Admin1',
          },
        }),
        dbService.role.create({
          data: {
            name: 'Admin2',
          },
        }),
      ])

      const permissions = await Promise.all([
        dbService.permission.create({
          data: {
            action: 'ALL',
            resource: 'ARTICLE',
            scope: 'GLOBAL',
          },
        }),
        dbService.permission.create({
          data: {
            action: 'ALL',
            resource: 'ARTICLE',
            scope: 'SELF',
          },
        }),
      ])

      await Promise.all([
        dbService.rolePermission.create({
          data: {
            role_id: roles[0].id,
            permission_id: permissions[0].id,
          },
        }),
        dbService.rolePermission.create({
          data: {
            role_id: roles[1].id,
            permission_id: permissions[1].id,
          },
        }),
      ])

      const paginationData = {
        position: 0,
        limit: 12,
      }

      const findedRp = await rolePermissionService.findMany(paginationData)

      expect(findedRp.items).toHaveLength(2)
      expect(findedRp.pagination.total).toEqual(2)
      expect(findedRp.pagination.limit).toEqual(12)
      expect(findedRp.pagination.position).toEqual(0)
    })
  })
})
