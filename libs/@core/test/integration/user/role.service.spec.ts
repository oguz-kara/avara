import { ConfigModule, ConfigService } from '@nestjs/config'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { RoleService } from '@avara/core/modules/user/application/services/role.service'
import { RolePermissionService } from '@avara/core/modules/user/application/services/role-permission.service'
import { DbService } from '@avara/shared/database/db-service'
import { appConfig } from '@avara/core/modules/user/config/app.config'
import { RoleRepository } from '@avara/core/modules/user/infrastructure/orm/repository/role.repository'
import { RoleMapper } from '@avara/core/modules/user/infrastructure/mappers/role.mapper'
import { PaginationUtils } from '@avara/core/modules/user/application/utils/pagination.util'
import { PermissionService } from '@avara/core/modules/user/application/services/permission.service'
import { PermissionRepository } from '@avara/core/modules/user/infrastructure/orm/repository/permission.repository'
import { PermissionMapper } from '@avara/core/modules/user/infrastructure/mappers/permission.mapper'
import { RolePermissionMapper } from '@avara/core/modules/user/infrastructure/mappers/role-permission.mapper'
import { RolePermissionRepository } from '@avara/core/modules/user/infrastructure/orm/repository/role-permission.repository'
import { DBTransactionService } from '@avara/shared/database/db-transaction'
import {
  CreateRoleDto,
  RenameRoleDto,
} from '@avara/core/modules/user/application/graphql/dto/role.dto'

describe('RoleService (Integration)', () => {
  let roleService: RoleService
  let rolePermissionService: RolePermissionService
  let dbService: DbService

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => ({ app: appConfig })],
        }),
      ],
      providers: [
        RoleService,
        RoleRepository,
        DbService,
        RoleMapper,
        PaginationUtils,
        ConfigService,
        PermissionService,
        PermissionRepository,
        PermissionMapper,
        RolePermissionMapper,
        RolePermissionRepository,
        RolePermissionService,
        DBTransactionService,
      ],
    }).compile()

    roleService = module.get<RoleService>(RoleService)
    rolePermissionService = module.get<RolePermissionService>(
      RolePermissionService,
    )
    dbService = module.get<DbService>(DbService)
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

  describe('createRole', () => {
    it('should create a new role successfully', async () => {
      const input: CreateRoleDto = { name: 'Admin' }
      const result = await roleService.createRole(input)

      expect(result.name).toBe('Admin')

      const savedRole = await dbService.role.findUnique({
        where: { id: result.id },
      })
      expect(savedRole).toBeTruthy()
      expect(savedRole?.name).toBe('Admin')
    })

    it('should throw ConflictException if role name already exists', async () => {
      const input: CreateRoleDto = { name: 'Admin' }
      await roleService.createRole(input)

      await expect(roleService.createRole(input)).rejects.toThrow(
        ConflictException,
      )
    })
  })

  describe('renameRoleById', () => {
    it('should rename role by id', async () => {
      const createRoleInput: CreateRoleDto = { name: 'Old_Admin' }
      const role = await roleService.createRole(createRoleInput)

      const renameRoleInput: RenameRoleDto = {
        id: role.id,
        name: 'Renamed_Admin',
      }

      const renamedRole = await roleService.renameRoleById(
        renameRoleInput.id,
        renameRoleInput.name,
      )

      expect(renamedRole.name).toBe('Renamed_Admin')

      const savedRole = await dbService.role.findUnique({
        where: { id: role.id },
      })

      expect(savedRole).toBeTruthy()
      expect(savedRole?.name).toBe('Renamed_Admin')
    })

    it('should throw ConflictException if role by provided name already exists', async () => {
      const input: CreateRoleDto = { name: 'ALREADY_EXISTS_ROLE' }
      await roleService.createRole(input)

      await expect(roleService.createRole(input)).rejects.toThrow(
        ConflictException,
      )
    })
  })

  describe('findById', () => {
    it('should find a role successfully by role id', async () => {
      const createRoleInput: CreateRoleDto = { name: 'Admin' }
      const role = await roleService.createRole(createRoleInput)

      const retrievedRole = await roleService.findById(role.id)

      expect(retrievedRole).toBeTruthy()
      expect(retrievedRole.id).toBe(role.id)
      expect(retrievedRole.name).toBe(role.name)
    })

    it('should return null if role by provided name not exists', async () => {
      const findRoleByIdResult = await roleService.findById('NOT_EXISTS_ID')

      expect(findRoleByIdResult).toBeNull()
    })
  })

  describe('findByName', () => {
    it('should find a role successfully by role name', async () => {
      const createRoleInput: CreateRoleDto = { name: 'Admin' }
      const role = await roleService.createRole(createRoleInput)

      const retrievedRole = await roleService.findById(role.id)

      expect(retrievedRole).toBeTruthy()
      expect(retrievedRole.id).toBe(role.id)
      expect(retrievedRole.name).toBe(role.name)
    })

    it('should return null if role by provided name not exists', async () => {
      const findRoleByIdResult = await roleService.findById('NOT_EXISTS_ID')

      expect(findRoleByIdResult).toBeNull()
    })
  })

  describe('findMany', () => {
    it('should retrieve all roles when roles exist', async () => {
      await roleService.createRole({ name: 'Role1' })
      await roleService.createRole({ name: 'Role2' })
      await roleService.createRole({ name: 'Role3' })

      const rolesData = await roleService.findMany()

      expect(rolesData.items).toHaveLength(3)
      expect(rolesData.items.map((r) => r.name)).toEqual(
        expect.arrayContaining(['Role1', 'Role2', 'Role3']),
      )
      expect(rolesData.pagination).toEqual({ total: 3, limit: 25, position: 0 })
    })

    it('should return an empty array when no roles exist', async () => {
      const roles = await roleService.findMany()

      expect(roles.items).toEqual([])
    })
  })

  describe('removeRoleById', () => {
    it('should remove a role successfully by role ID', async () => {
      const role = await roleService.createRole({ name: 'Role1' })

      const roleDataBeforeDeletion = await roleService.findMany()
      expect(roleDataBeforeDeletion.items).toHaveLength(1)
      expect(roleDataBeforeDeletion.items[0].id).toEqual(role.id)

      const removedRole = await roleService.removeRoleById(role.id)

      const roleDataAfterDeletion = await roleService.findMany()
      expect(roleDataAfterDeletion.items).toHaveLength(0)

      expect(removedRole.id).toEqual(role.id)
    })

    it('should throw a ConflictException if no role exists to remove', async () => {
      // Attempt to remove a non-existent role and check for the correct error
      await expect(
        roleService.removeRoleById('non-existent-id'),
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('setPermissionsOfRole', () => {
    it('should assign permissions to a role successfully', async () => {
      const role = await dbService.role.create({ data: { name: 'Role1' } })

      const permissions = await Promise.all([
        dbService.permission.create({
          data: { action: 'UPDATE', resource: 'USER', scope: 'SELF' },
        }),
        dbService.permission.create({
          data: { action: 'UPDATE', resource: 'USER', scope: 'GLOBAL' },
        }),
      ])

      const roleWithPermissions = await roleService.setPermissions(
        role.id,
        permissions.map((p) => p.id),
      )

      const rolePermissionsBefore = await rolePermissionService.findMany()

      expect(roleWithPermissions.permissions).toHaveLength(2)
      expect(rolePermissionsBefore.items).toHaveLength(2)
      expect(roleWithPermissions.permissions.map((p) => p.id).sort()).toEqual(
        permissions.map((p) => p.id).sort(),
      )

      const newPermissions = await Promise.all([
        dbService.permission.create({
          data: { action: 'DELETE', resource: 'USER', scope: 'SELF' },
        }),
        dbService.permission.create({
          data: { action: 'DELETE', resource: 'USER', scope: 'GLOBAL' },
        }),
        dbService.permission.create({
          data: { action: 'WRITE', resource: 'USER', scope: 'GLOBAL' },
        }),
      ])

      const roleWithUpdatedPermissions = await roleService.setPermissions(
        role.id,
        newPermissions.map((p) => p.id),
      )

      const rolePermissionsAfter = await rolePermissionService.findMany()

      expect(rolePermissionsAfter.items).toHaveLength(3)
      expect(roleWithUpdatedPermissions.permissions).toHaveLength(3)
      expect(
        roleWithUpdatedPermissions.permissions.map((p) => p.id).sort(),
      ).toEqual(newPermissions.map((p) => p.id).sort())
    })
  })
})
