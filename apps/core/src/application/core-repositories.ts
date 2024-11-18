import { Injectable } from '@nestjs/common'
import { RoleRepository } from '../domain/user/infrastructure/orm/repository/role.repository'
import { UserRepository } from '../domain/user/infrastructure/orm/repository/user.repository'
import { PermissionRepository } from '../domain/user/infrastructure/orm/repository/permission.repository'
import { RolePermissionRepository } from '../domain/user/infrastructure/orm/repository/role-permission.repository'
import { AdministratorRepository } from '../domain/user/infrastructure/orm/repository/administrator.repository'
import { ChannelRepository } from '../domain/channel/infrastructure/repositories/channel.repository'
import { SeoMetadataRepository } from '../domain/seo-metadata/infrastructure/repositories/seo-metadata.repository'
import { CategoryRepository } from '../domain/category/infrastructure/repositories/category.repository'
import { RequestContext } from '../application/context/request-context'
import { AssetRepository } from '../domain/asset/infrastructure/orm/repositories/asset.repository'
import { PersistenceContext } from '../database/channel-aware-repository.interface'

type EntityRepositoryMap = {
  Role: RoleRepository
  User: UserRepository
  Permission: PermissionRepository
  RolePermission: RolePermissionRepository
  Administrator: AdministratorRepository
  Category: CategoryRepository
  Channel: ChannelRepository
  SeoMetadata: SeoMetadataRepository
  Asset: AssetRepository
}

@Injectable()
export class CoreRepositories {
  private readonly repositories = new Map<
    keyof EntityRepositoryMap,
    EntityRepositoryMap[keyof EntityRepositoryMap]
  >()
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
    private readonly administratorRepository: AdministratorRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly channelRepository: ChannelRepository,
    private readonly seoMetadataRepository: SeoMetadataRepository,
    private readonly assetRepository: AssetRepository,
  ) {
    this.repositories.set('Asset', assetRepository)
  }

  get<E extends keyof EntityRepositoryMap>(
    ctx: RequestContext,
    entity: E,
    persistenceContext?: PersistenceContext,
  ): EntityRepositoryMap[E] {
    const repository = this.repositories.get(entity) as EntityRepositoryMap[E]
    if (!repository) {
      throw new Error(`Repository for ${entity} not found`)
    }
    repository.saveContext(ctx)
    if (persistenceContext?.tx)
      repository.setTransactionObject(persistenceContext.tx)
    return repository
  }
}
