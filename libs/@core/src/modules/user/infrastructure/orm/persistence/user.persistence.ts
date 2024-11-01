import { UserActiveStatus } from '@prisma/client'

export interface UserPersistence {
  id: string | null
  email: string
  password_hash: string
  email_verified: boolean
  role_id: string
  is_active: UserActiveStatus
  created_at: Date
  created_by: string
  updated_at: Date
  updated_by: string
  deleted_at?: Date
  deleted_by?: string
}
