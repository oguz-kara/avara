import { UserActiveStatus as UserActiveStatusPersistence } from '@prisma/client'
import {
  UserActiveStatus,
  UserActiveStatus as UserActiveStatusDomain,
} from '../../domain/enums/user-active-status.enum'
import { UserPersistence } from '../orm/persistence/user.persistence'
import { Injectable } from '@nestjs/common'
import { User } from '../../domain/entities/user.entity'
import { Mapper } from '@avara/shared/database/mapper.interface'

@Injectable()
export class UserMapper implements Mapper<User, UserPersistence> {
  toDomain(entity: UserPersistence): User {
    return new User({
      id: entity.id,
      email: entity.email,
      password_hash: entity.password_hash,
      email_verified: entity.email_verified,
      role_id: entity.role_id,
      is_active: this.mapActiveStatusToDomain(entity.is_active),
      created_at: entity.created_at,
      created_by: entity.created_by,
      updated_at: entity.updated_at,
      updated_by: entity.updated_by,
      deleted_at: entity.deleted_at,
      deleted_by: entity.deleted_by,
    })
  }

  toPersistence(entity: User): UserPersistence {
    return {
      id: entity.id,
      email: entity.email,
      password_hash: entity.password_hash,
      role_id: entity.role_id,
      email_verified: entity.email_verified,
      is_active: this.mapActiveStatusToPersistence(
        entity.is_active as UserActiveStatus,
      ),
      created_at: entity.created_at,
      created_by: entity.created_by,
      updated_at: entity.updated_at,
      updated_by: entity.updated_by,
      deleted_at: entity.deleted_at,
      deleted_by: entity.deleted_by,
    }
  }

  private mapActiveStatusToDomain(
    status: UserActiveStatusPersistence,
  ): UserActiveStatusDomain {
    switch (status) {
      case UserActiveStatusPersistence.ACTIVE:
        return UserActiveStatusDomain.ACTIVE
      case UserActiveStatusPersistence.INACTIVE:
        return UserActiveStatusDomain.INACTIVE
      default:
        throw new Error(`Unknown status: ${status}`)
    }
  }

  private mapActiveStatusToPersistence(
    status: UserActiveStatusDomain,
  ): UserActiveStatusPersistence {
    switch (status) {
      case UserActiveStatusDomain.ACTIVE:
        return UserActiveStatusPersistence.ACTIVE
      case UserActiveStatusDomain.INACTIVE:
        return UserActiveStatusPersistence.INACTIVE
      default:
        throw new Error(`Unknown status: ${status}`)
    }
  }
}
