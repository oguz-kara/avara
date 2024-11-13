import { CreateRolePermissionDto } from '@avara/core/user/application/graphql/dto/role-permission.dto'
import { RolePermissionService } from '@avara/core/user/application/services/role-permission.service'
import { PaginationUtils } from '@avara/shared/utils/pagination.util'
import { appConfig } from '@avara/core/user/config/app.config'
import { PermissionMapper } from '@avara/core/user/infrastructure/mappers/permission.mapper'
import { RolePermissionMapper } from '@avara/core/user/infrastructure/mappers/role-permission.mapper'
import { RoleMapper } from '@avara/core/user/infrastructure/mappers/role.mapper'
import { RolePermissionRepository } from '@avara/core/user/infrastructure/orm/repository/role-permission.repository'
import { DbService } from '@avara/shared/database/db-service'
import { ConflictException } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { PermissionService } from '@avara/core/user/application/services/permission.service'
import { PermissionRepository } from '@avara/core/user/infrastructure/orm/repository/permission.repository'
import { ChannelRepository } from '@avara/core/channel/infrastructure/repositories/channel.repository'
import { CoreRepositories } from '@avara/core/application/core-repositories'
import { ChannelMapper } from '@avara/core/channel/infrastructure/mappers/channel.mapper'
import { UserRepository } from '@avara/core/user/infrastructure/orm/repository/user.repository'
import { UserMapper } from '@avara/core/user/infrastructure/mappers/user.mapper'
import { RoleRepository } from '@avara/core/user/infrastructure/orm/repository/role.repository'
import { RequestContext } from '@avara/core/context/request-context'
import { Channel } from '@avara/core/channel/domain/entities/channel.entity'
import { RoleService } from '@avara/core/user/application/services/role.service'
import {
  ActionType,
  ResourceType,
  ScopeType,
} from '@avara/core/user/application/enums'
import { AdministratorRepository } from '@avara/core/user/infrastructure/orm/repository/administrator.repository'
import { AdministratorMapper } from '@avara/core/user/infrastructure/mappers/administrator.mapper'

describe('RolePermissionService (Integration)', () => {
  let rolePermissionService: RolePermissionService
  let dbService: DbService
  let permissionService: PermissionService
  let roleService: RoleService
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
        PermissionService,
        PermissionRepository,
        DbService,
        PermissionMapper,
        PaginationUtils,
        ConfigService,
        ChannelRepository,
        CoreRepositories,
        AdministratorRepository,
        AdministratorMapper,
        ChannelMapper,
        UserRepository,
        PermissionRepository,
        RolePermissionRepository,
        UserMapper,
        RoleRepository,
        RolePermissionMapper,
        RoleMapper,
        RolePermissionService,
        RoleService,
      ],
    }).compile()

    dbService = module.get<DbService>(DbService)
    rolePermissionService = module.get<RolePermissionService>(
      RolePermissionService,
    )
    permissionService = module.get<PermissionService>(PermissionService)
    roleService = module.get<RoleService>(RoleService)
    channelRepository = module.get<ChannelRepository>(ChannelRepository)
    await dbService.$transaction([
      dbService.rolePermission.deleteMany(),
      dbService.permission.deleteMany(),
      dbService.user.deleteMany(),
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
      dbService.channel.deleteMany(),
      dbService.role.deleteMany(),
    ])
  })

  describe('createRolePermission', () => {
    it('should create a new role permission successfully', async () => {
      const role = await roleService.createRole(ctx, {
        name: 'Admin',
      })
      const permission = await permissionService.createPermission(ctx, {
        action: ActionType.READ,
        resource: ResourceType.USER,
        scope: ScopeType.GLOBAL,
      })

      const input: CreateRolePermissionDto = {
        role_id: role.id,
        permission_id: permission.id,
        is_active: true,
      }

      const result = await rolePermissionService.createRolePermission(
        ctx,
        input,
      )

      const rolePermission = await dbService.rolePermission.findUnique({
        where: { id: result.id },
        include: {
          channels: true,
        },
      })

      expect(rolePermission.channels).toHaveLength(1)
      expect(rolePermission.channels[0].name).toBe(ctx.channel.name)
      expect(result).toBeTruthy()
      expect(result.role_id).toBe(input.role_id)
      expect(result.permission_id).toBe(input.permission_id)

      expect(rolePermission).toBeTruthy()
      expect(rolePermission?.role_id).toBe(input.role_id)
      expect(rolePermission?.permission_id).toBe(input.permission_id)
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

      await rolePermissionService.createRolePermission(ctx, input)

      await expect(
        rolePermissionService.createRolePermission(ctx, input),
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

      const rolePermission = await rolePermissionService.createRolePermission(
        ctx,
        {
          role_id: role.id,
          permission_id: permission.id,
          is_active: true,
        },
      )

      const result = await rolePermissionService.findById(
        ctx,
        rolePermission.id,
      )

      expect(result).toBeTruthy()
      expect(result.id).toBe(rolePermission.id)
      expect(result.role_id).toBe(rolePermission.role_id)
      expect(result.permission_id).toBe(rolePermission.permission_id)
    })

    it('should return null if role permission not found for a channel', async () => {
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

      const noChannelCtx = new RequestContext({
        channel: null,
        channel_code: 'fake-channel',
        channel_id: 'fake-channel-id',
        currency_code: 'USD',
        language_code: 'en',
      })

      const result = await rolePermissionService.findById(
        noChannelCtx,
        rolePermission.id,
      )

      expect(result).toBeFalsy()
      expect(result).toBe(null)
    })

    it('should return null if role permission not found', async () => {
      const result = await rolePermissionService.findById(
        ctx,
        'non-existent-id',
      )

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
        rolePermissionService.createRolePermission(ctx, {
          role_id: roles[0].id,
          permission_id: permissions[0].id,
          is_active: true,
        }),
        rolePermissionService.createRolePermission(ctx, {
          role_id: roles[1].id,
          permission_id: permissions[1].id,
          is_active: true,
        }),
      ])

      const paginationData = {
        position: 0,
        limit: 12,
      }

      const findedRp = await rolePermissionService.findMany(ctx, paginationData)

      expect(findedRp.items).toHaveLength(2)
      expect(findedRp.pagination.total).toEqual(2)
      expect(findedRp.pagination.limit).toEqual(12)
      expect(findedRp.pagination.position).toEqual(0)
    })
  })
})
