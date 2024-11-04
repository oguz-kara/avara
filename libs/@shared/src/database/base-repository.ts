import { ConflictException } from '@nestjs/common'
import { CoreEntity } from '../domain/core-entity.abstract'
import { DbService } from './db-service'
import { Mapper } from './mapper.interface'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/modules/user/api/types/pagination.type'

export class BaseRepository<D extends CoreEntity, P> {
  constructor(
    protected readonly db: DbService,
    protected readonly entity:
      | 'user'
      | 'role'
      | 'permission'
      | 'productCategory',
    protected readonly mapper: Mapper<D, P>,
  ) {
    this.entity = entity
  }

  async save(entity: D): Promise<void> {
    if (entity.id) {
      const persistence = this.mapper.toPersistence(entity)

      const result = (await (this.db[this.entity] as any).update({
        where: {
          id: entity.id,
        },
        data: persistence,
      })) as P

      if (!result)
        throw new ConflictException(
          `An error occurred when updating the ${this.entity}!`,
        )
    } else {
      const persistence = this.mapper.toPersistence(entity)

      const result = (await (this.db[this.entity] as any).create({
        data: persistence,
      })) as P

      if (!(result as any)?.id)
        throw new ConflictException(
          `An error occurred when creating the ${this.entity}!`,
        )

      entity.assignId((result as any).id)
    }
  }

  async remove(id: string): Promise<D> {
    const result = (await (this.db[this.entity] as any).delete({
      where: {
        id,
      },
    })) as P

    return this.mapper.toDomain(result)
  }

  async findById(id: string): Promise<D> {
    const result = (await (this.db[this.entity] as any).findUnique({
      where: {
        id,
      },
    })) as P

    return this.mapper.toDomain(result)
  }

  async findAll(args: PaginationParams): Promise<PaginatedList<D>> {
    const result = (await (this.db[this.entity] as any).findMany()) as P[]

    return {
      items: result.map((item) => this.mapper.toDomain(item)),
      pagination: {
        total: result.length,
        limit: args.limit,
        position: args.position,
      },
    }
  }
}
