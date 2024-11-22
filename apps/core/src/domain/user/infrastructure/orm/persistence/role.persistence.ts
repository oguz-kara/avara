import { ChannelPersistence } from '@avara/core/domain/channel/infrastructure/orm/channel.persistence'
import { PermissionPersistence } from './permission.persistence'

export interface RolePersistence {
  id: string | null
  name: string
  permissions?: PermissionPersistence[]
  channels?: ChannelPersistence[]
  createdAt?: Date
  createdBy?: string
  updatedAt?: Date
  updatedBy?: string
  deletedAt?: Date
  deletedBy?: string
}
