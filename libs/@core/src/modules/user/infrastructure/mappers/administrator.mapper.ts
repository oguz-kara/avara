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
      created_by: entity.created_by,
      updated_by: entity.updated_by,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      deleted_at: entity.deleted_at,
    })
  }

  toPersistence(entity: Administrator): AdministratorPersistence {
    return {
      id: entity.id,
      email: entity.email,
      user: this.userMapper.toPersistence(entity.user),
      created_by: entity.created_by,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
      updated_by: entity.updated_by,
      deleted_at: entity.deleted_at,
      deleted_by: entity.deleted_by,
    }
  }
}
