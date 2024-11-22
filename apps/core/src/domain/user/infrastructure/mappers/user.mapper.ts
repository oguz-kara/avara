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
      passwordHash: entity.passwordHash,
      emailVerified: entity.emailVerified,
      roleId: entity.roleId,
      isActive: this.mapActiveStatusToDomain(entity.isActive),
      createdAt: entity.createdAt,
      createdBy: entity.createdBy,
      updatedAt: entity.updatedAt,
      updatedBy: entity.updatedBy,
      deletedAt: entity.deletedAt,
      deletedBy: entity.deletedBy,
    })
  }

  toPersistence(entity: User): UserPersistence {
    return {
      id: entity.id,
      email: entity.email,
      passwordHash: entity.passwordHash,
      roleId: entity.roleId,
      emailVerified: entity.emailVerified,
      isActive: this.mapActiveStatusToPersistence(
        entity.isActive as UserActiveStatus,
      ),
      createdAt: entity.createdAt,
      createdBy: entity.createdBy,
      updatedAt: entity.updatedAt,
      updatedBy: entity.updatedBy,
      deletedAt: entity.deletedAt,
      deletedBy: entity.deletedBy,
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
