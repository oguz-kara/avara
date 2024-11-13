import { User } from '@avara/core/user/domain/entities/user.entity'

export interface UserEmailFinderRepository {
  findByEmail(email: string): Promise<User | null>
}
