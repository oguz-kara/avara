import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { CreateRolePermissionDto } from '../graphql/dto/role-permission.dto'
import { RolePermission } from '../../domain/entities/role-permission.entity'
import { PaginationUtils } from '../../../../../../@shared/src/utils/pagination.util'
import { PaginationParams } from '../../api/types/pagination.type'
import { PaginatedItemsResponse } from '../../api/types/items-response.type'
import { RequestContext } from '@avara/core/context/request-context'
import { CoreRepositories } from '@avara/core/core-repositories'

@Injectable()
export class RolePermissionService {
  constructor(
    private readonly repositories: CoreRepositories,
    private readonly paginationUtils: PaginationUtils,
  ) {}

  async createRolePermission(
    ctx: RequestContext,
    input: CreateRolePermissionDto,
  ) {
    const rolePermissionRepo = this.repositories.get(
      ctx,
      'RolePermission',
    )
    const { is_active, permission_id, role_id } = input

    const rolePermission = await rolePermissionRepo.findRolePermission(
      role_id,
      permission_id,
    )

    if (rolePermission)
      throw new ConflictException('Role permission already exists!')

    const newRolePermission = new RolePermission({
      id: undefined,
      is_active,
      permission_id,
      role_id,
    })

    await rolePermissionRepo.saveResourceToChannel(newRolePermission)

    return newRolePermission
  }

  async findById(
    ctx: RequestContext,
    id: string,
  ): Promise<RolePermission | null> {
    const rolePermissionRepo = this.repositories.get(
      ctx,
      'RolePermission',
    )
    const rolePermission = await rolePermissionRepo.findOneInChannel(id)

    return rolePermission
  }

  async findMany(
    ctx: RequestContext,
    params?: PaginationParams,
  ): Promise<PaginatedItemsResponse<RolePermission>> {
    const rolePermissionRepo = this.repositories.get(
      ctx,
      'RolePermission',
    )
    const { limit, position } =
      this.paginationUtils.validateAndGetPaginationLimit(params)

    const rolePermissionsData = await rolePermissionRepo.findManyInChannel({
      limit,
      position,
    })

    return rolePermissionsData
  }

  async removeRolePermissionById(ctx: RequestContext, id: string) {
    const rolePermissionRepo = this.repositories.get(
      ctx,
      'RolePermission',
    )
    const rolePermission = await rolePermissionRepo.findOneInChannel(id)

    if (!rolePermission)
      throw new NotFoundException('Role permission not found!')

    await rolePermissionRepo.removeResourceInChannel(rolePermission)

    return rolePermission
  }

  async softRemoveRolePermissionById(ctx: RequestContext, id: string) {
    const rolePermissionRepo = this.repositories.get(
      ctx,
      'RolePermission',
    )
    const rolePermission = await rolePermissionRepo.findOneInChannel(id)

    if (!rolePermission)
      throw new NotFoundException('Role permission not found!')

    rolePermission.softDelete()

    await rolePermissionRepo.saveResourceToChannel(rolePermission)

    return rolePermission
  }

  async recoverRolePermissionById(ctx: RequestContext, id: string) {
    const rolePermissionRepo = this.repositories.get(
      ctx,
      'RolePermission',
    )
    const rolePermission = await rolePermissionRepo.findOneInChannel(id)

    if (!rolePermission)
      throw new NotFoundException('Role permission not found!')

    rolePermission.softRecover()

    await rolePermissionRepo.saveResourceToChannel(rolePermission)

    return rolePermission
  }
}
