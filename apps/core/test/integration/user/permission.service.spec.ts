import { ConfigModule, ConfigService } from '@nestjs/config'
import { ConflictException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { PermissionService } from '@avara/core/domain/user/application/services/permission.service'
import { DbService } from '@avara/shared/database/db-service'
import { PermissionRepository } from '@avara/core/domain/user/infrastructure/orm/repository/permission.repository'
import { PermissionMapper } from '@avara/core/domain/user/infrastructure/mappers/permission.mapper'
import { PaginationUtils } from '@avara/shared/utils/pagination.util'
import { appConfig } from '@avara/core/config/app.config'
import { CreatePermissionDto } from '@avara/core/domain/user/application/graphql/dto/permission.dto'
import {
  ActionType,
  ResourceType,
  ScopeType,
} from '@avara/core/domain/user/application/enums'
import { PermissionString } from '@avara/core/domain/user/api/types/permission.types'
import { ChannelRepository } from '@avara/core/domain/channel/infrastructure/repositories/channel.repository'
import { RequestContext } from '@avara/core/application/context/request-context'
import { Channel } from '@avara/core/domain/channel/domain/entities/channel.entity'
import { CoreRepositories } from '@avara/core/shared/core-repositories'
import { UserRepository } from '@avara/core/domain/user/infrastructure/orm/repository/user.repository'
import { RolePermissionRepository } from '@avara/core/domain/user/infrastructure/orm/repository/role-permission.repository'
import { UserMapper } from '@avara/core/domain/user/infrastructure/mappers/user.mapper'
import { RoleRepository } from '@avara/core/domain/user/infrastructure/orm/repository/role.repository'
import { RolePermissionMapper } from '@avara/core/domain/user/infrastructure/mappers/role-permission.mapper'
import { RoleMapper } from '@avara/core/domain/user/infrastructure/mappers/role.mapper'
import { AdministratorMapper } from '@avara/core/domain/user/infrastructure/mappers/administrator.mapper'
import { AdministratorRepository } from '@avara/core/domain/user/infrastructure/orm/repository/administrator.repository'
import { RolePermissionService } from '@avara/core/domain/user/application/services/role-permission.service'
import { DBTransactionService } from '@avara/shared/database/db-transaction'
import { RoleService } from '@avara/core/domain/user/application/services/role.service'
import { SeoMetadataRepository } from '@avara/core/domain/seo-metadata/infrastructure/repositories/seo-metadata.repository'
import { SeoMetadataMapper } from '@avara/core/domain/seo-metadata/infrastructure/mappers/seo-metadata.mapper'

describe('PermissionService (Integration)', () => {
  let permissionService: PermissionService
  let dbService: DbService
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
        CoreRepositories,
        UserRepository,
        PermissionRepository,
        RolePermissionRepository,
        UserMapper,
        SeoMetadataRepository,
        SeoMetadataMapper,
        AdministratorMapper,
        AdministratorRepository,
      ],
    }).compile()

    dbService = module.get<DbService>(DbService)
    permissionService = module.get<PermissionService>(PermissionService)
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
      dbService.channel.deleteMany(),
    ])
  })

  describe('createPermission', () => {
    it('should create a new permission successfully', async () => {
      const input: CreatePermissionDto = {
        action: ActionType.READ,
        resource: ResourceType.USER,
        scope: ScopeType.GLOBAL,
      }

      const result = await permissionService.createPermission(ctx, input)

      const permission = await dbService.permission.findFirst({
        where: {
          id: result.id,
        },
        include: {
          channels: true,
        },
      })

      expect(permission.channels).toHaveLength(1)
      expect(permission.channels[0].id).toBe(ctx.channel_id)

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

      await permissionService.createPermission(ctx, input)

      await expect(
        permissionService.createPermission(ctx, input),
      ).rejects.toThrow(ConflictException)
    })
  })

  describe('findById', () => {
    it('should find a permission by id successfully', async () => {
      const permission = await permissionService.createPermission(ctx, {
        action: ActionType.READ,
        resource: ResourceType.USER,
        scope: ScopeType.GLOBAL,
      })

      const result = await permissionService.findById(ctx, permission.id)

      expect(result).toBeTruthy()
      expect(result.id).toBe(permission.id)
      expect(result.action).toBe(permission.action)
      expect(result.resource).toBe(permission.resource)
      expect(result.scope).toBe(permission.scope)
    })

    it('should return null if permission not found', async () => {
      const result = await permissionService.findById(ctx, 'non-existent-id')

      expect(result).toBeNull()
    })
  })

  describe('findByName', () => {
    it('should find a permission by name successfully', async () => {
      const permission = await permissionService.createPermission(ctx, {
        action: ActionType.READ,
        resource: ResourceType.USER,
        scope: ScopeType.GLOBAL,
      })

      const name = `${permission.action}:${permission.resource}:${permission.scope}`

      const result = await permissionService.findByName(
        ctx,
        name as PermissionString,
      )

      expect(result).toBeTruthy()
      expect(result.id).toBe(permission.id)
      expect(result.action).toBe(permission.action)
      expect(result.resource).toBe(permission.resource)
      expect(result.scope).toBe(permission.scope)
    })

    it('should return null if permission not found', async () => {
      const result = await permissionService.findByName(ctx, 'READ:USER:GLOBAL')

      expect(result).toBeNull()
    })
  })

  describe('findMany', () => {
    it('should retrieve all permissions with pagination', async () => {
      await Promise.all([
        await permissionService.createPermission(ctx, {
          action: ActionType.READ,
          resource: ResourceType.USER,
          scope: ScopeType.GLOBAL,
        }),
        await permissionService.createPermission(ctx, {
          action: ActionType.WRITE,
          resource: ResourceType.USER,
          scope: ScopeType.GLOBAL,
        }),
      ])

      const paginationParams = { limit: 10, position: 0 }

      const result = await permissionService.findMany(ctx, paginationParams)

      expect(result.items).toHaveLength(2)
      expect(result.pagination.total).toBe(2)
      expect(result.pagination.limit).toBe(10)
      expect(result.pagination.position).toBe(0)
    })
  })
})
