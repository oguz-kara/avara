import { Injectable } from '@nestjs/common'
import { RoleRepository } from '../user/infrastructure/orm/repository/role.repository'
import { UserRepository } from '../user/infrastructure/orm/repository/user.repository'
import { PermissionRepository } from '../user/infrastructure/orm/repository/permission.repository'
import { RolePermissionRepository } from '../user/infrastructure/orm/repository/role-permission.repository'
import { AdministratorRepository } from '../user/infrastructure/orm/repository/administrator.repository'
import { ChannelRepository } from '../channel/infrastructure/repositories/channel.repository'
import { SeoMetadataRepository } from '../seo-metadata/infrastructure/repositories/seo-metadata.repository'
import { CategoryRepository } from '../category/infrastructure/repositories/category.repository'
import { RequestContext } from './context/request-context'

type EntityRepositoryMap = {
  Role: RoleRepository
  User: UserRepository
  Permission: PermissionRepository
  RolePermission: RolePermissionRepository
  Administrator: AdministratorRepository
  Category: CategoryRepository
  Channel: ChannelRepository
  SeoMetadata: SeoMetadataRepository
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
  ) {
    this.repositories.set('Role', roleRepository)
    this.repositories.set('User', userRepository)
    this.repositories.set('Permission', permissionRepository)
    this.repositories.set('RolePermission', rolePermissionRepository)
    this.repositories.set('Administrator', administratorRepository)
    this.repositories.set('Category', categoryRepository)
    this.repositories.set('Channel', channelRepository)
    this.repositories.set('SeoMetadata', seoMetadataRepository)
  }

  get<E extends keyof EntityRepositoryMap>(
    ctx: RequestContext,
    entity: E,
  ): EntityRepositoryMap[E] {
    const repository = this.repositories.get(entity) as EntityRepositoryMap[E]
    if (!repository) {
      throw new Error(`Repository for ${entity} not found`)
    }
    repository.saveContext(ctx)
    return repository
  }
}
