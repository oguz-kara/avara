import { Injectable } from '@nestjs/common'
import { RoleRepository } from './modules/user/infrastructure/orm/repository/role.repository'
import { RequestContext } from './context/request-context'
import { UserRepository } from './modules/user/infrastructure/orm/repository/user.repository'
import { PermissionRepository } from './modules/user/infrastructure/orm/repository/permission.repository'
import { RolePermissionRepository } from './modules/user/infrastructure/orm/repository/role-permission.repository'
import { AdministratorRepository } from './modules/user/infrastructure/orm/repository/administrator.repository'

type EntityRepositoryMap = {
  Role: RoleRepository
  User: UserRepository
  Permission: PermissionRepository
  RolePermission: RolePermissionRepository
  Administrator: AdministratorRepository
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
  ) {
    this.repositories.set('Role', roleRepository)
    this.repositories.set('User', userRepository)
    this.repositories.set('Permission', permissionRepository)
    this.repositories.set('RolePermission', rolePermissionRepository)
    this.repositories.set('Administrator', administratorRepository)
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
