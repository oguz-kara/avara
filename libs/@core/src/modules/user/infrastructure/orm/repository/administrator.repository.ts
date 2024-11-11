import { ConflictException, Injectable } from '@nestjs/common'
import { DbService } from '../../../../../../../@shared/src/database/db-service'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/modules/user/api/types/pagination.type'
import { Ids } from '@avara/core/modules/user/api/types/filters.type'
import { ContextSaver } from '@avara/shared/database/channel-aware-repository.interface'
import { Repository } from '@avara/shared/database/repository.interface'
import { Administrator } from '../../../domain/entities/administrator.entity'
import { AdministratorMapper } from '../../mappers/administrator.mapper'

@Injectable()
export class AdministratorRepository
  extends ContextSaver
  implements Repository<Administrator>
{
  constructor(
    private readonly administratorMapper: AdministratorMapper,
    private readonly db: DbService,
  ) {
    super()
  }

  async findOneById(id: string): Promise<Administrator | null> {
    const administrator = await this.db.administrator.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!administrator) return null

    return this.administratorMapper.toDomain(administrator)
  }

  async findMany(
    args: PaginationParams & Ids,
  ): Promise<PaginatedList<Administrator>> {
    const { limit, position, ids } = args

    const total = await this.db.administrator.count()

    const users = await this.db.administrator.findMany({
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

  async remove(resource: Administrator): Promise<void> {
    const { id } = resource

    const administrator = await this.db.administrator.findFirst({
      where: { id },
    })

    if (!administrator) throw new ConflictException('Administrator not found!')

    await this.db.administrator.delete({
      where: { id },
    })
  }

  async save(administrator: Administrator): Promise<void> {
    const persistenceAdministrator =
      this.administratorMapper.toPersistence(administrator)

    if (administrator.id) {
      await this.db.administrator.update({
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
      const createdAdministrator = await this.db.administrator.create({
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
