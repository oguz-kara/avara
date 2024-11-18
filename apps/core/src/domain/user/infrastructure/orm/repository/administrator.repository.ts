import { ConflictException, Injectable } from '@nestjs/common'
import { DbService } from '../../../../../../../../libs/@shared/src/database/db-service'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/domain/user/api/types/pagination.type'
import { Ids } from '@avara/core/domain/user/api/types/filters.type'
import {
  ContextSaver,
  PersistenceContext,
} from '@avara/core/database/channel-aware-repository.interface'
import { Repository } from '@avara/shared/database/repository.interface'
import { Administrator } from '../../../domain/entities/administrator.entity'
import { AdministratorMapper } from '../../mappers/administrator.mapper'
import { PrismaClient } from '@prisma/client'
import { DbTransactionalClient } from '@avara/shared/database/db-transactional-client'
import { TransactionAware } from '@avara/shared/database/transaction-aware.abstract'

@Injectable()
export class AdministratorRepository
  extends ContextSaver
  implements Repository<Administrator>, TransactionAware
{
  transaction: DbTransactionalClient | null = null

  constructor(
    private readonly administratorMapper: AdministratorMapper,
    private readonly db: DbService,
  ) {
    super()
  }

  setTransactionObject(transaction: DbTransactionalClient): void {
    this.transaction = transaction
  }

  getClient(tx: DbTransactionalClient): DbTransactionalClient | PrismaClient {
    return tx ? tx : this.transaction ? this.transaction : this.db
  }

  async findOneById(
    id: string,
    persistenceContext?: PersistenceContext,
  ): Promise<Administrator | null> {
    const administrator = await this.getClient(
      persistenceContext?.tx,
    ).administrator.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!administrator) return null

    return this.administratorMapper.toDomain(administrator)
  }

  async findMany(
    args: PaginationParams & Ids,
    persistenceContext?: PersistenceContext,
  ): Promise<PaginatedList<Administrator>> {
    const { limit, position, ids } = args

    const total = await this.getClient(
      persistenceContext?.tx,
    ).administrator.count()

    const users = await this.getClient(
      persistenceContext?.tx,
    ).administrator.findMany({
      where: {
        AND: [
          {
            id: {
              in: ids,
            },
          },
        ],
      },
      take: limit,
      skip: position,
      include: {
        user: true,
      },
    })

    return {
      items: users.map((administrator) =>
        this.administratorMapper.toDomain(administrator),
      ),
      pagination: {
        total,
        limit,
        position,
      },
    }
  }

  async remove(
    resource: Administrator,
    persistenceContext?: PersistenceContext,
  ): Promise<void> {
    const { id } = resource

    const administrator = await this.getClient(
      persistenceContext?.tx,
    ).administrator.findFirst({
      where: { id },
    })

    if (!administrator) throw new ConflictException('Administrator not found!')

    await this.getClient(persistenceContext?.tx).administrator.delete({
      where: { id },
    })
  }

  async save(
    administrator: Administrator,
    persistenceContext?: PersistenceContext,
  ): Promise<void> {
    const persistenceAdministrator =
      this.administratorMapper.toPersistence(administrator)

    if (administrator.id) {
      await this.getClient(persistenceContext?.tx).administrator.update({
        where: {
          id: administrator.id,
        },
        data: {
          ...persistenceAdministrator,
          user: {
            update: {
              ...persistenceAdministrator.user,
            },
          },
        },
      })
    } else {
      const createdAdministrator = await this.getClient(
        persistenceContext?.tx,
      ).administrator.create({
        data: {
          ...persistenceAdministrator,
          user: {
            create: {
              ...persistenceAdministrator.user,
            },
          },
        },
      })

      if (!createdAdministrator.id)
        throw new ConflictException(
          'An error occurred when creating the administrator!',
        )

      administrator.assignId(createdAdministrator.id)
    }
  }
}
