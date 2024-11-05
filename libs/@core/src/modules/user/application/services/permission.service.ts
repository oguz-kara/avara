import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Permission } from '@avara/core/modules/user/domain/entities/permission.entity'
import { CreatePermissionDto } from '@avara/core/modules/user/application/graphql/dto/permission.dto'
import { PaginationUtils } from '@avara/shared/utils/pagination.util'
import { PermissionString } from '../../api/types/permission.types'
import { PermissionRepository } from '../../infrastructure/orm/repository/permission.repository'
import { PaginationParams } from '../../api/types/pagination.type'
import { PaginatedItemsResponse } from '../../api/types/items-response.type'

@Injectable()
export class PermissionService {
  constructor(
    private readonly repo: PermissionRepository,
    private readonly paginationUtils: PaginationUtils,
  ) {}

  async createPermission(input: CreatePermissionDto) {
    const name =
      `${input.action}:${input.resource}:${input.scope}` as PermissionString
    const existedPermission = await this.repo.findByName(name)

    if (existedPermission)
      throw new ConflictException('Permission already exists!')

    const permission = new Permission({
      id: undefined,
      resource: input.resource,
      action: input.action,
      scope: input.scope,
    })

    await this.repo.save(permission)

    return permission
  }

  async findById(id: string): Promise<Permission | null> {
    const permission = await this.repo.findById(id)

    return permission
  }

  async findByName(name: PermissionString): Promise<Permission | null> {
    const permission = await this.repo.findByName(name)

    return permission
  }

  async findMany(
    params?: PaginationParams,
  ): Promise<PaginatedItemsResponse<Permission>> {
    const { limit, position } =
      this.paginationUtils.validateAndGetPaginationLimit(params)

    const permissionsData = await this.repo.findAll({
      limit,
      position,
    })

    return permissionsData
  }

  async renamePermissionById(id: string, name: PermissionString) {
    const permission = await this.repo.findById(id)

    if (!permission) throw new NotFoundException('Permission not found!')

    const permissionName = await this.repo.findByName(name)

    if (permissionName)
      throw new ConflictException(
        'Permission already exists! Try another name.',
      )

    permission.renamePermission(name)

    await this.repo.save(permission)

    return permission
  }

  async removePermissionById(id: string) {
    const permission = await this.repo.findById(id)

    if (!permission) throw new NotFoundException('Permission not found!')

    const removedPermission = await this.repo.remove(id)

    return removedPermission
  }

  async softRemovePermissionById(id: string) {
    const permission = await this.repo.findById(id)

    if (!permission) throw new NotFoundException('Permission not found!')

    permission.softDelete()

    await this.repo.save(permission)

    return permission
  }

  async recoverPermissionById(id: string) {
    const permission = await this.repo.findById(id)

    if (!permission) throw new NotFoundException('Permission not found!')

    permission.softRecover()

    await this.repo.save(permission)

    return permission
  }

  async assignSpecificScopeId(permissionId: string, specificScopeId: string) {
    const permission = await this.repo.findById(permissionId)

    if (!permission) throw new NotFoundException('Permission not found!')

    permission.assignSpecificScopeId(specificScopeId)

    await this.repo.save(permission)

    return permission
  }
}
