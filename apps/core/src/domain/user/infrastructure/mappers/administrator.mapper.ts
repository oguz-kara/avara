import { Injectable } from '@nestjs/common'
import { Mapper } from '@avara/shared/database/mapper.interface'
import { Administrator } from '../../domain/entities/administrator.entity'
import { AdministratorPersistence } from '../orm/persistence/administrator.persistence'
import { UserMapper } from './user.mapper'

@Injectable()
export class AdministratorMapper
  implements Mapper<Administrator, AdministratorPersistence>
{
  constructor(private readonly userMapper: UserMapper) {}

  toDomain(entity: AdministratorPersistence): Administrator {
    return new Administrator({
      id: entity.id,
      email: entity.email,
      user: this.userMapper.toDomain(entity.user),
      createdBy: entity.createdBy,
      updatedBy: entity.updatedBy,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
    })
  }

  toPersistence(entity: Administrator): AdministratorPersistence {
    return {
      id: entity.id,
      email: entity.email,
      user: this.userMapper.toPersistence(entity.user),
      createdBy: entity.createdBy,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      updatedBy: entity.updatedBy,
      deletedAt: entity.deletedAt,
      deletedBy: entity.deletedBy,
    }
  }
}
