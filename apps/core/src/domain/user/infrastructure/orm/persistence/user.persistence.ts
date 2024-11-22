import { UserActiveStatus } from '@prisma/client'
import { UserActiveStatus as AppUserActiveStatus } from '../../../domain/enums/user-active-status.enum'

export interface UserPersistence {
  id: string | null
  email: string
  passwordHash: string
  emailVerified: boolean
  roleId: string
  isActive: UserActiveStatus | AppUserActiveStatus
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
  deletedAt?: Date
  deletedBy?: string
}
