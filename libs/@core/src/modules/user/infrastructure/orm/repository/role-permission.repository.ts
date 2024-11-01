import { ConflictException, Injectable } from '@nestjs/common'

import { RolePermissionMapper } from '../../mappers/role-permission.mapper'
import { PrismaClient } from '@prisma/client'
import { TransactionAware } from '../../../../../../../@shared/src/database/transaction-aware.abstract'
import { Repository } from '../../../../../../../@shared/src/database/repository.interface'
import { RolePermission } from '@avara/core/modules/user/domain/entities/role-permission.entity'
import { DbService } from '../../../../../../../@shared/src/database/db-service'
import { DbTransactionalClient } from '../../../../../../../@shared/src/database/db-transactional-client'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/modules/user/api/types/pagination.type'

@Injectable()
export class RolePermissionRepository
  extends TransactionAware
  implements Repository<RolePermission>
{
  constructor(
    private readonly rolePermissionMapper: RolePermissionMapper,
    private readonly db: DbService,
  ) {
    super()
  }

  getClient(): DbTransactionalClient | PrismaClient {
    return (this.transaction ? this.transaction : this.db) as PrismaClient
  }

  async findById(id: string): Promise<RolePermission | null> {
    const rolePermission = await this.getClient().rolePermission.findUnique({
      where: { id },
      include: { role: true, permission: true },
    })

    if (!rolePermission) return null

    return this.rolePermissionMapper.toDomain(rolePermission)
  }

  async findByRoleId(role_id: string): Promise<RolePermission[]> {
    const rolePermissions = await this.getClient().rolePermission.findMany({
      where: { role_id },
      include: { permission: true, role: true },
    })

    return rolePermissions.map((rolePermission) =>
      this.rolePermissionMapper.toDomain(rolePermission),
    )
  }

  async findAll(
    args: PaginationParams,
  ): Promise<PaginatedList<RolePermission>> {
    const { limit, position } = args

    const total = await this.getClient().rolePermission.count()

    const rolePermissions = await this.getClient().rolePermission.findMany({
      take: limit,
      skip: position,
      include: {
        permission: true,
        role: true,
      },
    })

    return {
      items: rolePermissions.map((rolePermission) =>
        this.rolePermissionMapper.toDomain(rolePermission),
      ),
      pagination: {
        total,
        limit,
        position,
      },
    }
  }

  async remove(id: string): Promise<RolePermission | null> {
    const rolePermission = await this.getClient().rolePermission.findFirst({
      where: { id },
    })

    if (!rolePermission) return null

    const removedRolePermission = await this.getClient().rolePermission.delete({
      where: { id },
      include: {
        role: true,
        permission: true,
      },
    })

    return this.rolePermissionMapper.toDomain(removedRolePermission)
  }

  async save(rolePermission: RolePermission): Promise<void> {
    const { role_id, permission_id, ...rest } =
      this.rolePermissionMapper.toPersistence(rolePermission)

    if (rolePermission.id) {
      await this.getClient().rolePermission.update({
        where: { id: rolePermission.id },
        data: {
          ...rest,
          role: { connect: { id: role_id } },
          permission: { connect: { id: permission_id } },
        },
      })
    } else {
      const createdRolePermission =
        await this.getClient().rolePermission.create({
          data: {
            ...rest,
            role: { connect: { id: role_id } },
            permission: { connect: { id: permission_id } },
          },
        })

      if (!createdRolePermission.id)
        throw new ConflictException(
          'An error occurred when creating the rolePermission!',
        )

      rolePermission.assignId(createdRolePermission.id)
    }
  }

  async removePermissionsByRoleId(role_id: string, permissionIds: string[]) {
    await this.getClient().rolePermission.deleteMany({
      where: {
        role_id,
        permission_id: { in: permissionIds },
      },
    })

    return true
  }

  async addByRoleIdAndPermissionIds(role_id: string, permissionIds: string[]) {
    const data = permissionIds.map((permission_id) => ({
      role_id,
      permission_id,
    }))

    return this.getClient().rolePermission.createMany({
      data,
    })
  }

  async findRolePermission(
    role_id: string,
    permission_id: string,
  ): Promise<RolePermission | null> {
    const rp = await this.getClient().rolePermission.findFirst({
      where: {
        role_id,
        permission_id,
      },
    })

    return rp ? this.rolePermissionMapper.toDomain(rp) : null
  }
}
