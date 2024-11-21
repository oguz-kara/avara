import { ConfigModule, ConfigService } from '@nestjs/config'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { RoleService } from '@avara/core/domain/user/application/services/role.service'
import { RolePermissionService } from '@avara/core/domain/user/application/services/role-permission.service'
import { DbService } from '@avara/shared/database/db-service'
import { appConfig } from '@avara/core/config/app.config'
import { RoleRepository } from '@avara/core/domain/user/infrastructure/orm/repository/role.repository'
import { RoleMapper } from '@avara/core/domain/user/infrastructure/mappers/role.mapper'
import { PaginationUtils } from '@avara/shared/utils/pagination.util'
import { PermissionService } from '@avara/core/domain/user/application/services/permission.service'
import { PermissionRepository } from '@avara/core/domain/user/infrastructure/orm/repository/permission.repository'
import { PermissionMapper } from '@avara/core/domain/user/infrastructure/mappers/permission.mapper'
import { RolePermissionMapper } from '@avara/core/domain/user/infrastructure/mappers/role-permission.mapper'
import { RolePermissionRepository } from '@avara/core/domain/user/infrastructure/orm/repository/role-permission.repository'
import { DBTransactionService } from '@avara/shared/database/db-transaction'
import {
  CreateRoleDto,
  RenameRoleDto,
} from '@avara/core/domain/user/application/graphql/dto/role.dto'
import { ChannelRepository } from '@avara/core/domain/channel/infrastructure/repositories/channel.repository'
import { Channel } from '@avara/core/domain/channel/domain/entities/channel.entity'
import { RequestContext } from '@avara/core/application/context/request-context'
import { ChannelMapper } from '@avara/core/domain/channel/infrastructure/mappers/channel.mapper'
import { UserRepository } from '@avara/core/domain/user/infrastructure/orm/repository/user.repository'
import { UserMapper } from '@avara/core/domain/user/infrastructure/mappers/user.mapper'
import {
  ActionType,
  ResourceType,
  ScopeType,
} from '@avara/core/domain/user/application/enums'
import { CoreRepositories } from '@avara/core/application/core-repositories'

describe('RoleService (Integration)', () => {
  let roleService: RoleService
  let permissionService: PermissionService
  let dbService: DbService
  let rolePermissionService: RolePermissionService
  let channelRepository: ChannelRepository
  let ctx: RequestContext

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [appConfig],
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
        ChannelRepository,
        CoreRepositories,
        ChannelMapper,
        UserRepository,
        PermissionRepository,
        RolePermissionRepository,
        UserMapper,
      ],
    }).compile()

    roleService = module.get<RoleService>(RoleService)
    dbService = module.get<DbService>(DbService)
    rolePermissionService = module.get<RolePermissionService>(
      RolePermissionService,
    )
    channelRepository = module.get<ChannelRepository>(ChannelRepository)
    permissionService = module.get<PermissionService>(PermissionService)

    await dbService.$transaction([
      dbService.rolePermission.deleteMany(),
      dbService.permission.deleteMany(),
      dbService.role.deleteMany(),
      dbService.channel.deleteMany(),
    ])

    const channel = new Channel({
      id: undefined,
      name: 'Default',
      code: 'default',
      currency_code: 'USD',
      default_language_code: 'en',
      is_default: true,
    })

    await channelRepository.save(channel)

    ctx = new RequestContext({
      channel,
      channel_code: channel.code,
      channel_id: channel.id,
      currency_code: channel.currency_code,
      language_code: channel.default_language_code,
    })
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
      dbService.channel.deleteMany(),
    ])
  })

  describe('createRole', () => {
    it('should create a new role successfully', async () => {
      const input: CreateRoleDto = { name: 'Admin' }
      const result = await roleService.createRole(ctx, input)

      expect(result.name).toBe('Admin')

      const savedRole = await roleService.findById(ctx, result.id)
      expect(savedRole).toBeTruthy()
      expect(savedRole?.name).toBe('Admin')
    })

    it('should throw ConflictException if role name already exists', async () => {
      const input: CreateRoleDto = { name: 'Admin' }
      await roleService.createRole(ctx, input)

      await expect(roleService.createRole(ctx, input)).rejects.toThrow(
        ConflictException,
      )
    })
  })

  describe('renameRoleById', () => {
    it('should rename role by id', async () => {
      const createRoleInput: CreateRoleDto = { name: 'Old_Admin' }
      const role = await roleService.createRole(ctx, createRoleInput)

      const renameRoleInput: RenameRoleDto = {
        id: role.id,
        name: 'Renamed_Admin',
      }

      const renamedRole = await roleService.renameRoleById(
        ctx,
        renameRoleInput.id,
        renameRoleInput.name,
      )

      expect(renamedRole.name).toBe('Renamed_Admin')

      const savedRole = await roleService.findById(ctx, role.id)

      expect(savedRole).toBeTruthy()
      expect(savedRole?.name).toBe('Renamed_Admin')
    })

    it('should throw ConflictException if role by provided name already exists', async () => {
      const input: CreateRoleDto = { name: 'ALREADY_EXISTS_ROLE' }
      await roleService.createRole(ctx, input)

      await expect(roleService.createRole(ctx, input)).rejects.toThrow(
        ConflictException,
      )
    })
  })

  describe('findById', () => {
    it('should find a role successfully by role id', async () => {
      const createRoleInput: CreateRoleDto = { name: 'Admin' }
      const role = await roleService.createRole(ctx, createRoleInput)

      const retrievedRole = await roleService.findById(ctx, role.id)

      expect(retrievedRole).toBeTruthy()
      expect(retrievedRole.id).toBe(role.id)
      expect(retrievedRole.name).toBe(role.name)
    })

    it('should return null if role by provided name not exists', async () => {
      const findRoleByIdResult = await roleService.findById(
        ctx,
        'NOT_EXISTS_ID',
      )

      expect(findRoleByIdResult).toBeNull()
    })
  })

  describe('findByName', () => {
    it('should find a role successfully by role name', async () => {
      const createRoleInput: CreateRoleDto = { name: 'Admin' }
      const role = await roleService.createRole(ctx, createRoleInput)

      const retrievedRole = await roleService.findById(ctx, role.id)

      expect(retrievedRole).toBeTruthy()
      expect(retrievedRole.id).toBe(role.id)
      expect(retrievedRole.name).toBe(role.name)
    })

    it('should return null if role by provided name not exists', async () => {
      const findRoleByIdResult = await roleService.findById(
        ctx,
        'NOT_EXISTS_ID',
      )

      expect(findRoleByIdResult).toBeNull()
    })
  })

  describe('findMany', () => {
    it('should retrieve all roles when roles exist', async () => {
      await roleService.createRole(ctx, { name: 'Role1' })
      await roleService.createRole(ctx, { name: 'Role2' })
      await roleService.createRole(ctx, { name: 'Role3' })

      const rolesData = await roleService.findMany(ctx)

      expect(rolesData.items).toHaveLength(3)
      expect(rolesData.items.map((r) => r.name)).toEqual(
        expect.arrayContaining(['Role1', 'Role2', 'Role3']),
      )
      expect(rolesData.pagination).toEqual({
        total: 3,
        limit: 25,
        position: 0,
      })
    })

    it('should return an empty array when no roles exist', async () => {
      const roles = await roleService.findMany(ctx)

      expect(roles.items).toEqual([])
    })
  })

  describe('removeRoleById', () => {
    it('should remove a role successfully by role ID', async () => {
      const role = await roleService.createRole(ctx, { name: 'Role1' })

      const roleDataBeforeDeletion = await roleService.findMany(ctx)
      expect(roleDataBeforeDeletion.items).toHaveLength(1)
      expect(roleDataBeforeDeletion.items[0].id).toEqual(role.id)

      await roleService.removeRoleById(ctx, role.id)

      const roleDataAfterDeletion = await roleService.findMany(ctx)
      expect(roleDataAfterDeletion.items).toHaveLength(0)
    })

    it('should throw a ConflictException if no role exists to remove', async () => {
      // Attempt to remove a non-existent role and check for the correct error
      await expect(
        roleService.removeRoleById(ctx, 'non-existent-id'),
      ).rejects.toThrow(NotFoundException)
    })
  })

  describe('setPermissionsOfRole', () => {
    it('should assign permissions to a role successfully', async () => {
      const role = await roleService.createRole(ctx, {
        name: 'Role1',
      })

      const permissions = await Promise.all([
        permissionService.createPermission(ctx, {
          action: ActionType.UPDATE,
          resource: ResourceType.USER,
          scope: ScopeType.SELF,
        }),
        permissionService.createPermission(ctx, {
          action: ActionType.UPDATE,
          resource: ResourceType.USER,
          scope: ScopeType.GLOBAL,
        }),
      ])

      const roleWithPermissions = await roleService.setPermissions(
        ctx,
        role.id,
        permissions.map((p) => p.id),
      )

      const rolePermissionsBefore = await rolePermissionService.findMany(ctx)

      expect(roleWithPermissions.permissions).toHaveLength(2)
      expect(rolePermissionsBefore.items).toHaveLength(2)
      expect(roleWithPermissions.permissions.map((p) => p.id).sort()).toEqual(
        permissions.map((p) => p.id).sort(),
      )

      const newPermissions = await Promise.all([
        permissionService.createPermission(ctx, {
          action: ActionType.DELETE,
          resource: ResourceType.USER,
          scope: ScopeType.SELF,
        }),
        permissionService.createPermission(ctx, {
          action: ActionType.DELETE,
          resource: ResourceType.USER,
          scope: ScopeType.GLOBAL,
        }),
        permissionService.createPermission(ctx, {
          action: ActionType.WRITE,
          resource: ResourceType.USER,
          scope: ScopeType.GLOBAL,
        }),
      ])

      const roleWithUpdatedPermissions = await roleService.setPermissions(
        ctx,
        role.id,
        newPermissions.map((p) => p.id),
      )

      const rolePermissionsAfter = await rolePermissionService.findMany(ctx)

      expect(rolePermissionsAfter.items).toHaveLength(3)
      expect(roleWithUpdatedPermissions.permissions).toHaveLength(3)
      expect(
        roleWithUpdatedPermissions.permissions.map((p) => p.id).sort(),
      ).toEqual(newPermissions.map((p) => p.id).sort())
    })
  })
})
