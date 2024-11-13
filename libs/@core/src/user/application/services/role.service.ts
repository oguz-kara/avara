import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Role } from '../../domain/entities/role.entity'
import { CreateRoleDto } from '../graphql/dto/role.dto'
import { PaginationUtils } from '../../../../../@shared/src/utils/pagination.util'
import { PaginationParams } from '../../api/types/pagination.type'
import { PaginatedItemsResponse } from '../../api/types/items-response.type'
import { PermissionRepository } from '../../infrastructure/orm/repository/permission.repository'
import { RequestContext } from '@avara/core/application/context/request-context'
import { RoleFactory } from '../../domain/factories/role.factory'
import { CoreRepositories } from '@avara/core/application/core-repositories'

@Injectable()
export class RoleService {
  constructor(
    private readonly repositories: CoreRepositories,
    private readonly permissionRepo: PermissionRepository,
    private readonly paginationUtils: PaginationUtils,
  ) {}

  async createRole(ctx: RequestContext, input: CreateRoleDto) {
    const roleRepo = this.repositories.get(ctx, 'Role')
    const existedRole = await roleRepo.findOneByNameInChannel(input.name)

    if (existedRole) throw new ConflictException('Role already exists!')

    const role = RoleFactory.createRole(input, ctx)

    await roleRepo.save(role)

    return role
  }

  async findById(ctx: RequestContext, id: string): Promise<Role | null> {
    const roleRepo = this.repositories.get(ctx, 'Role')
    const role = await roleRepo.findOneInChannel(id)

    return role
  }

  async findByName(ctx: RequestContext, name: string): Promise<Role | null> {
    const roleRepo = this.repositories.get(ctx, 'Role')
    const role = await roleRepo.findOneByNameInChannel(name)

    return role
  }

  async findMany(
    ctx: RequestContext,
    params?: PaginationParams,
  ): Promise<PaginatedItemsResponse<Role>> {
    const { limit, position } =
      this.paginationUtils.validateAndGetPaginationLimit(params)
    const roleRepo = this.repositories.get(ctx, 'Role')

    const rolesData = await roleRepo.findManyInChannel({
      limit,
      position,
    })

    return rolesData
  }

  async renameRoleById(ctx: RequestContext, id: string, name: string) {
    const roleRepo = this.repositories.get(ctx, 'Role')
    const role = await roleRepo.findOneInChannel(id)

    if (!role) throw new NotFoundException('Role not found to rename!')

    const roleName = await roleRepo.findOneByNameInChannel(name)

    if (roleName)
      throw new ConflictException('Role already exists! Try another name.')

    role.renameRole(name)

    await roleRepo.save(role)

    return role
  }

  async removeRoleById(ctx: RequestContext, id: string) {
    const roleRepo = this.repositories.get(ctx, 'Role')

    const role = await roleRepo.findOneInChannel(id)

    if (!role) throw new NotFoundException('Role not found to remove!')

    const removedRole = await roleRepo.removeResourceInChannel(role)

    return removedRole
  }

  async setPermissions(
    ctx: RequestContext,
    roleId: string,
    permissionIds: string[],
  ) {
    const roleRepo = this.repositories.get(ctx, 'Role')

    const role = await roleRepo.findOneInChannel(roleId)

    if (!role) throw new NotFoundException('Role not found to set permissions!')

    const permissions = await this.permissionRepo.findManyInChannel({
      ids: permissionIds,
    })

    if (permissions.items.length !== permissionIds.length) {
      throw new NotFoundException(
        'Some permission(s) not found! Please check the permission ID(s)',
      )
    }

    role.setPermissions(permissions.items)

    await roleRepo.save(role)

    return role
  }
}
