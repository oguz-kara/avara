import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Role } from '../../domain/entities/role.entity'
import { CreateRoleDto } from '../graphql/dto/role.dto'
import { RoleRepository } from '../../infrastructure/orm/repository/role.repository'
import { PaginationUtils } from '../../../../../../@shared/src/utils/pagination.util'
import { PaginationParams } from '../../api/types/pagination.type'
import { PaginatedItemsResponse } from '../../api/types/items-response.type'
import { PermissionRepository } from '../../infrastructure/orm/repository/permission.repository'

@Injectable()
export class RoleService {
  constructor(
    private readonly repo: RoleRepository,
    private readonly permissionRepo: PermissionRepository,
    private readonly paginationUtils: PaginationUtils,
  ) {}

  async createRole(input: CreateRoleDto) {
    const existedRole = await this.repo.findByName(input.name)

    if (existedRole) throw new ConflictException('Role already exists!')

    const role = new Role({
      id: undefined,
      name: input.name,
      permissions: [],
    })

    await this.repo.save(role)

    return role
  }

  async findById(id: string): Promise<Role | null> {
    const role = await this.repo.findById(id)

    return role
  }

  async findByName(name: string): Promise<Role | null> {
    const role = await this.repo.findByName(name)

    return role
  }

  async findMany(
    params?: PaginationParams,
  ): Promise<PaginatedItemsResponse<Role>> {
    const { limit, position } =
      this.paginationUtils.validateAndGetPaginationLimit(params)

    const rolesData = await this.repo.findAll({
      limit,
      position,
    })

    return rolesData
  }

  async renameRoleById(id: string, name: string) {
    const role = await this.repo.findById(id)

    if (!role) throw new NotFoundException('Role not found to rename!')

    const roleName = await this.repo.findByName(name)

    if (roleName)
      throw new ConflictException('Role already exists! Try another name.')

    role.renameRole(name)

    await this.repo.save(role)

    return role
  }

  async removeRoleById(id: string) {
    const role = await this.repo.findById(id)

    if (!role) throw new NotFoundException('Role not found to remove!')

    const removedRole = await this.repo.remove(id)

    return removedRole
  }

  async setPermissions(roleId: string, permissionIds: string[]) {
    const role = await this.repo.findById(roleId)

    if (!role) throw new NotFoundException('Role not found to set permissions!')

    const permissions = await this.permissionRepo.findAll({
      ids: permissionIds,
    })

    if (permissions.items.length !== permissionIds.length) {
      throw new NotFoundException(
        'Some permission(s) not found! Please check the permission ID(s)',
      )
    }

    role.setPermissions(permissions.items)

    await this.repo.save(role)

    return role
  }
}
