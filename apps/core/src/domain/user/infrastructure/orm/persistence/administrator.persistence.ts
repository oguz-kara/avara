import { ID } from '@avara/shared/types/id.type'
import { UserPersistence } from './user.persistence'

export interface AdministratorPersistence {
  id: ID | undefined

  email: string

  user: UserPersistence

  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
  deletedAt: Date
  deletedBy: string
}
