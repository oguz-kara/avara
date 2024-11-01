import { ConflictException, Injectable } from '@nestjs/common'

import { Repository } from '@avara/shared/database/repository.interface'
import { Role } from '@avara/core/modules/user/domain/entities/role.entity'
import { DbService } from '@avara/shared/database/db-service'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/modules/user/api/types/pagination.type'

import { RoleMapper } from '../../mappers/role.mapper'
import { NameFinderRepository } from '../../interfaces/name-finder'

@Injectable()
export class RoleRepository
  implements Repository<Role>, NameFinderRepository<Role>
{
  constructor(
    private readonly roleMapper: RoleMapper,
    private readonly db: DbService,
  ) {}

  async findById(id: string): Promise<Role | null> {
    const role = await this.db.role.findUnique({
      where: { id },
      select: { id: true, name: true },
    })

    if (!role) return null

    return this.roleMapper.toDomain(role)
  }

  async findByName(name: string): Promise<Role | null> {
    const role = await this.db.role.findFirst({
      where: { name },
      select: { id: true, name: true },
    })

    if (!role) return null

    return this.roleMapper.toDomain(role)
  }

  async findAll(args: PaginationParams): Promise<PaginatedList<Role>> {
    const { limit, position } = args

    const total = await this.db.role.count()

    const users = await this.db.role.findMany({
      take: limit,
      skip: position,
      select: {
        id: true,
        name: true,
      },
    })

    return {
      items: users.map((role) => this.roleMapper.toDomain(role)),
      pagination: {
        total,
        limit,
        position,
      },
    }
  }

  async remove(id: string): Promise<Role | null> {
    const role = await this.db.role.findFirst({
      where: { id },
    })

    if (!role) return null

    const removedRole = await this.db.role.delete({
      where: { id },
    })

    return this.roleMapper.toDomain(removedRole)
  }

  async save(role: Role): Promise<void> {
    const { permissions, ...persistenceRole } =
      this.roleMapper.toPersistence(role)

    if (role.id) {
      await this.db.role.update({
        where: { id: role.id },
        data: {
          ...persistenceRole,
          ...(permissions &&
            permissions.length > 0 && {
              role_permissions: {
                deleteMany: {},
                createMany: {
                  data: permissions.map((permission) => ({
                    permission_id: permission.id,
                  })),
                },
              },
            }),
        },
      })
    } else {
      const createdRole = await this.db.role.create({
        data: {
          name: persistenceRole.name,
        },
      })

      if (!createdRole.id)
        throw new ConflictException('An error occurred when creating the role!')

      role.assignId(createdRole.id)
    }
  }
}
