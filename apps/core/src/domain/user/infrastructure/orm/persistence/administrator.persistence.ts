import { ID } from '@avara/shared/types/id.type'
import { UserPersistence } from './user.persistence'

export interface AdministratorPersistence {
  id: ID | undefined

  email: string

  user: UserPersistence

  created_at: Date
  created_by: string
  updated_at: Date
  updated_by: string
  deleted_at: Date
  deleted_by: string
}
