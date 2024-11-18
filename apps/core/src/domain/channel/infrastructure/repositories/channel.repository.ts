import { ConflictException, Injectable } from '@nestjs/common'
import { DbService } from '@avara/shared/database/db-service'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/domain/user/api/types/pagination.type'
import {
  ContextSaver,
  PersistenceContext,
} from '@avara/core/database/channel-aware-repository.interface'
import { ChannelMapper } from '../mappers/channel.mapper'
import { Channel } from '../../domain/entities/channel.entity'
import { PrismaClient } from '@prisma/client'
import { DbTransactionalClient } from '@avara/shared/database/db-transactional-client'
import { TransactionAware } from '@avara/shared/database/transaction-aware.abstract'

@Injectable()
export class ChannelRepository
  extends ContextSaver
  implements TransactionAware
{
  transaction: DbTransactionalClient | null = null

  constructor(
    private readonly db: DbService,
    private readonly mapper: ChannelMapper,
  ) {
    super()
  }

  setTransactionObject(transaction: DbTransactionalClient): void {
    this.transaction = transaction
  }

  getClient(tx: DbTransactionalClient): DbTransactionalClient | PrismaClient {
    return tx ? tx : this.transaction ? this.transaction : this.db
  }

  async save(
    channel: Channel,
    persistenceContext?: PersistenceContext,
  ): Promise<void> {
    const client = this.getClient(persistenceContext?.tx)
    if (channel.id) {
      const persistence = this.mapper.toPersistence(channel)

      const result = await client.channel.update({
        where: {
          id: channel.id,
        },
        data: persistence,
      })

      if (!result)
        throw new ConflictException(
          `An error occurred when updating the channel!`,
        )
    } else {
      const persistence = this.mapper.toPersistence(channel)

      const result = await client.channel.create({
        data: persistence,
      })

      if (!result?.id)
        throw new ConflictException(
          `An error occurred when creating the channel!`,
        )

      channel.assignId(result.id)
    }
  }

  async remove(
    id: string,
    persistenceContext?: PersistenceContext,
  ): Promise<Channel> {
    const client = this.getClient(persistenceContext?.tx)
    const result = await client.channel.delete({
      where: {
        id,
      },
    })

    return this.mapper.toDomain(result)
  }

  async findById(
    id: string,
    persistenceContext?: PersistenceContext,
  ): Promise<Channel | null> {
    const client = this.getClient(persistenceContext?.tx)
    const result = await client.channel.findUnique({
      where: {
        id,
      },
    })

    if (!result) return null

    return this.mapper.toDomain(result)
  }

  async findDefaultChannel(
    persistenceContext?: PersistenceContext,
  ): Promise<Channel | null> {
    const client = this.getClient(persistenceContext?.tx)
    const result = await client.channel.findFirst({
      where: {
        is_default: true,
      },
    })

    if (!result) return null

    return this.mapper.toDomain(result)
  }

  async findAll(
    args: PaginationParams,
    persistenceContext?: PersistenceContext,
  ): Promise<PaginatedList<Channel>> {
    const client = this.getClient(persistenceContext?.tx)
    const result = await client.channel.findMany({
      where: {
        deleted_at: null,
      },
    })

    return {
      items: result.map((item) => this.mapper.toDomain(item)),
      pagination: {
        total: result.length,
        limit: args.limit,
        position: args.position,
      },
    }
  }

  async findByCode(
    code: string,
    persistenceContext?: PersistenceContext,
  ): Promise<Channel | null> {
    const client = this.getClient(persistenceContext?.tx)
    const channel = await client.channel.findUnique({
      where: {
        code,
      },
    })

    if (!channel) return null

    return this.mapper.toDomain(channel)
  }

  async findMany(
    params: PaginationParams,
    persistenceContext?: PersistenceContext,
  ): Promise<PaginatedList<Channel> | null> {
    const client = this.getClient(persistenceContext?.tx)
    const result = await client.channel.findMany({
      take: params?.limit,
      skip: params?.position,
    })

    return {
      items: result.map((item) => this.mapper.toDomain(item)),
      pagination: {
        total: result.length,
        limit: params.limit,
        position: params.position,
      },
    }
  }
}
