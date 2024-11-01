import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { CreateRolePermissionDto } from '../graphql/dto/role-permission.dto'
import { RolePermission } from '../../domain/entities/role-permission.entity'
import { PaginationUtils } from '../utils/pagination.util'
import { RolePermissionRepository } from '../../infrastructure/orm/repository/role-permission.repository'
import { PaginationParams } from '../../api/types/pagination.type'
import { PaginatedItemsResponse } from '../../api/types/items-response.type'

@Injectable()
export class RolePermissionService {
  constructor(
    private readonly repo: RolePermissionRepository,
    private readonly paginationUtils: PaginationUtils,
  ) {}

  async createRolePermission(input: CreateRolePermissionDto) {
    const { is_active, permission_id, role_id } = input

    const rolePermission = await this.repo.findRolePermission(
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

    await this.repo.save(newRolePermission)

    return newRolePermission
  }

  async findById(id: string): Promise<RolePermission | null> {
    const rolePermission = await this.repo.findById(id)

    return rolePermission
  }

  async findMany(
    params?: PaginationParams,
  ): Promise<PaginatedItemsResponse<RolePermission>> {
    const { limit, position } =
      this.paginationUtils.validateAndGetPaginationLimit(params)

    const rolePermissionsData = await this.repo.findAll({
      limit,
      position,
    })

    return rolePermissionsData
  }

  async removeRolePermissionById(id: string) {
    const rolePermission = await this.repo.findById(id)

    if (!rolePermission)
      throw new NotFoundException('Role permission not found!')

    const removedRolePermission = await this.repo.remove(id)

    return removedRolePermission
  }

  async softRemoveRolePermissionById(id: string) {
    const rolePermission = await this.repo.findById(id)

    if (!rolePermission)
      throw new NotFoundException('Role permission not found!')

    rolePermission.softDelete()

    await this.repo.save(rolePermission)

    return rolePermission
  }

  async recoverRolePermissionById(id: string) {
    const rolePermission = await this.repo.findById(id)

    if (!rolePermission)
      throw new NotFoundException('Role permission not found!')

    rolePermission.softRecover()

    await this.repo.save(rolePermission)

    return rolePermission
  }
}
