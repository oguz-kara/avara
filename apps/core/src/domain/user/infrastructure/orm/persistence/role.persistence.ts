import { ChannelPersistence } from '@avara/core/domain/channel/infrastructure/orm/channel.persistence'
import { PermissionPersistence } from './permission.persistence'

export interface RolePersistence {
  id: string | null
  name: string
  permissions?: PermissionPersistence[]
  channels?: ChannelPersistence[]
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
  deleted_at?: Date
  deleted_by?: string
}
