import { ConflictException, Injectable } from '@nestjs/common'
import { DbService } from '@avara/shared/database/db-service'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/domain/user/api/types/pagination.type'
import { ContextSaver } from '@avara/core/database/channel-aware-repository.interface'
import { ChannelMapper } from '../mappers/channel.mapper'
import { Channel } from '../../domain/entities/channel.entity'

@Injectable()
export class ChannelRepository extends ContextSaver {
  constructor(
    private readonly db: DbService,
    private readonly mapper: ChannelMapper,
  ) {
    super()
  }

  async save(channel: Channel): Promise<void> {
    if (channel.id) {
      const persistence = this.mapper.toPersistence(channel)

      const result = await this.db.channel.update({
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

      const result = await this.db.channel.create({
        data: persistence,
      })

      if (!result?.id)
        throw new ConflictException(
          `An error occurred when creating the channel!`,
        )

      channel.assignId(result.id)
    }
  }

  async remove(id: string): Promise<Channel> {
    const result = await this.db.channel.delete({
      where: {
        id,
      },
    })

    return this.mapper.toDomain(result)
  }

  async findById(id: string): Promise<Channel | null> {
    const result = await this.db.channel.findUnique({
      where: {
        id,
      },
    })

    if (!result) return null

    return this.mapper.toDomain(result)
  }

  async findDefaultChannel(): Promise<Channel | null> {
    const result = await this.db.channel.findFirst({
      where: {
        is_default: true,
      },
    })

    if (!result) return null

    return this.mapper.toDomain(result)
  }

  async findAll(args: PaginationParams): Promise<PaginatedList<Channel>> {
    const result = await this.db.channel.findMany({
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

  async findByCode(code: string): Promise<Channel | null> {
    const channel = await this.db.channel.findUnique({
      where: {
        code,
      },
    })

    if (!channel) return null

    return this.mapper.toDomain(channel)
  }

  async findMany(
    params: PaginationParams,
  ): Promise<PaginatedList<Channel> | null> {
    const result = await this.db.channel.findMany({
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
