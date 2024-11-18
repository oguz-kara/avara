import { User } from '@avara/core/domain/user/domain/entities/user.entity'
import { UserMapper } from '../../mappers/user.mapper'
import { UserEmailFinderRepository } from './user-email-finder.repository'
import { Injectable } from '@nestjs/common'
import { DbService } from '../../../../../../../../libs/@shared/src/database/db-service'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/domain/user/api/types/pagination.type'
import {
  ContextSaver,
  PersistenceContext,
} from '@avara/core/database/channel-aware-repository.interface'
import { PrismaClient } from '@prisma/client'
import { DbTransactionalClient } from '@avara/shared/database/db-transactional-client'
import { TransactionAware } from '@avara/shared/database/transaction-aware.abstract'

@Injectable()
export class UserRepository
  extends ContextSaver
  implements UserEmailFinderRepository, TransactionAware
{
  transaction: DbTransactionalClient | null = null

  constructor(
    private readonly db: DbService,
    private readonly userMapper: UserMapper,
  ) {
    super()
  }

  setTransactionObject(transaction: DbTransactionalClient): void {
    this.transaction = transaction
  }

  getClient(tx: DbTransactionalClient): DbTransactionalClient | PrismaClient {
    return tx ? tx : this.transaction ? this.transaction : this.db
  }

  async findById(
    id: string,
    persistenceContext?: PersistenceContext,
  ): Promise<User | null> {
    const user = await this.getClient(persistenceContext?.tx).user.findUnique({
      where: { id },
    })

    if (!user) return null

    return this.userMapper.toDomain(user)
  }

  async findAll(
    args: PaginationParams,
    persistenceContext?: PersistenceContext,
  ): Promise<PaginatedList<User>> {
    const { limit, position } = args

    const total = await this.getClient(persistenceContext?.tx).user.count()

    const users = await this.getClient(persistenceContext?.tx).user.findMany({
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

  async findByEmail(
    email: string,
    persistenceContext?: PersistenceContext,
  ): Promise<User | null> {
    const user = await this.getClient(persistenceContext?.tx).user.findUnique({
      where: { email },
    })

    if (!user) return null

    return this.userMapper.toDomain(user)
  }

  async remove(
    id: string,
    persistenceContext?: PersistenceContext,
  ): Promise<User | null> {
    const role = await this.getClient(persistenceContext?.tx).user.findFirst({
      where: { AND: [{ id }, { deleted_at: null }] },
    })

    if (!role) return null

    const removedUser = await this.getClient(
      persistenceContext?.tx,
    ).user.update({
      where: { id },
      data: { deleted_at: new Date() },
    })

    return this.userMapper.toDomain(removedUser)
  }

  async save(
    user: User,
    persistenceContext?: PersistenceContext,
  ): Promise<void> {
    const persistenceUser = this.userMapper.toPersistence(user)
    if (user.id) {
      await this.getClient(persistenceContext?.tx).user.update({
        where: { id: user.id },
        data: persistenceUser,
      })
    } else {
      const { role_id, ...rest } = persistenceUser

      const newUser = await this.getClient(persistenceContext?.tx).user.create({
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
