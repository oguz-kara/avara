import { User } from '@avara/core/modules/user/domain/entities/user.entity'
import { UserMapper } from '../../mappers/user.mapper'
import { Repository } from '../../../../../../../@shared/src/database/repository.interface'
import { UserEmailFinderRepository } from './user-email-finder.repository'
import { Injectable } from '@nestjs/common'
import { DbService } from '../../../../../../../@shared/src/database/db-service'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/modules/user/api/types/pagination.type'

@Injectable()
export class UserRepository
  implements Repository<User>, UserEmailFinderRepository
{
  constructor(
    private readonly db: DbService,
    private readonly userMapper: UserMapper,
  ) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.db.user.findUnique({ where: { id } })

    if (!user) return null

    return this.userMapper.toDomain(user)
  }

  async findAll(args: PaginationParams): Promise<PaginatedList<User>> {
    const { limit, position } = args

    const total = await this.db.user.count()

    const users = await this.db.user.findMany({
      take: limit,
      skip: position,
    })

    return {
      items: users.map((user) => this.userMapper.toDomain(user)),
      pagination: {
        total,
        limit,
        position,
      },
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.user.findUnique({ where: { email } })

    if (!user) return null

    return this.userMapper.toDomain(user)
  }

  async remove(id: string): Promise<User | null> {
    const role = await this.db.user.findFirst({
      where: { AND: [{ id }, { deleted_at: null }] },
    })

    if (!role) return null

    const removedUser = await this.db.user.update({
      where: { id },
      data: { deleted_at: new Date() },
    })

    return this.userMapper.toDomain(removedUser)
  }

  async save(user: User): Promise<void> {
    const persistenceUser = this.userMapper.toPersistence(user)
    if (user.id) {
      await this.db.user.update({
        where: { id: user.id },
        data: persistenceUser,
      })
    } else {
      const { role_id, ...rest } = persistenceUser

      const newUser = await this.db.user.create({
        data: {
          ...rest,
          role: {
            connect: {
              id: role_id,
            },
          },
        },
      })

      user.assignId(newUser.id)
    }
  }
}
