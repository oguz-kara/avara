import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Permission } from '@avara/core/user/domain/entities/permission.entity'
import { CreatePermissionDto } from '@avara/core/user/application/graphql/dto/permission.dto'
import { PaginationUtils } from '@avara/shared/utils/pagination.util'
import { PermissionString } from '../../api/types/permission.types'
import { PaginationParams } from '../../api/types/pagination.type'
import { PaginatedItemsResponse } from '../../api/types/items-response.type'
import { CoreRepositories } from '@avara/core/application/core-repositories'
import { RequestContext } from '@avara/core/application/context/request-context'

@Injectable()
export class PermissionService {
  constructor(
    private readonly repositories: CoreRepositories,
    private readonly paginationUtils: PaginationUtils,
  ) {}

  async createPermission(ctx: RequestContext, input: CreatePermissionDto) {
    const permissionRepo = this.repositories.get(ctx, 'Permission')
    const name =
      `${input.action}:${input.resource}:${input.scope}` as PermissionString
    const existedPermission = await permissionRepo.findOneByNameInChannel(name)

    if (existedPermission)
      throw new ConflictException('Permission already exists!')

    const permission = new Permission({
      id: undefined,
      resource: input.resource,
      action: input.action,
      scope: input.scope,
    })

    await permissionRepo.saveResourceToChannel(permission)

    return permission
  }

  async findById(ctx: RequestContext, id: string): Promise<Permission | null> {
    const permissionRepo = this.repositories.get(ctx, 'Permission')

    const permission = await permissionRepo.findOneInChannel(id)

    return permission
  }

  async findByName(
    ctx: RequestContext,
    name: PermissionString,
  ): Promise<Permission | null> {
    const permissionRepo = this.repositories.get(ctx, 'Permission')

    const permission = await permissionRepo.findOneByNameInChannel(name)

    return permission
  }

  async findMany(
    ctx: RequestContext,
    params?: PaginationParams,
  ): Promise<PaginatedItemsResponse<Permission>> {
    const permissionRepo = this.repositories.get(ctx, 'Permission')

    const { limit, position } =
      this.paginationUtils.validateAndGetPaginationLimit(params)

    const permissionsData = await permissionRepo.findManyInChannel({
      limit,
      position,
    })

    return permissionsData
  }

  async renamePermissionById(
    ctx: RequestContext,
    id: string,
    name: PermissionString,
  ) {
    const permissionRepo = this.repositories.get(ctx, 'Permission')

    const permission = await permissionRepo.findOneInChannel(id)

    if (!permission) throw new NotFoundException('Permission not found!')

    const permissionName = await permissionRepo.findOneByNameInChannel(name)

    if (permissionName)
      throw new ConflictException(
        'Permission already exists! Try another name.',
      )

    permission.renamePermission(name)

    await permissionRepo.saveResourceToChannel(permission)

    return permission
  }

  async removePermissionById(ctx: RequestContext, id: string) {
    const permissionRepo = this.repositories.get(ctx, 'Permission')

    const permission = await permissionRepo.findOneInChannel(id)

    if (!permission) throw new NotFoundException('Permission not found!')

    const removedPermission =
      await permissionRepo.removeResourceInChannel(permission)

    return removedPermission
  }

  async softRemovePermissionById(ctx: RequestContext, id: string) {
    const permissionRepo = this.repositories.get(ctx, 'Permission')

    const permission = await permissionRepo.findOneInChannel(id)

    if (!permission) throw new NotFoundException('Permission not found!')

    permission.softDelete()

    await permissionRepo.saveResourceToChannel(permission)

    return permission
  }

  async recoverPermissionById(ctx: RequestContext, id: string) {
    const permissionRepo = this.repositories.get(ctx, 'Permission')

    const permission = await permissionRepo.findOneInChannel(id)

    if (!permission) throw new NotFoundException('Permission not found!')

    permission.softRecover()

    await permissionRepo.saveResourceToChannel(permission)

    return permission
  }

  async assignSpecificScopeId(
    ctx: RequestContext,
    permissionId: string,
    specificScopeId: string,
  ) {
    const permissionRepo = this.repositories.get(ctx, 'Permission')

    const permission = await permissionRepo.findOneInChannel(permissionId)

    if (!permission) throw new NotFoundException('Permission not found!')

    permission.assignSpecificScopeId(specificScopeId)

    await permissionRepo.saveResourceToChannel(permission)

    return permission
  }
}
