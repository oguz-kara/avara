import {
  ResourceType as AppResourceType,
  ActionType as AppActionType,
  ScopeType as AppScopeType,
} from '@avara/core/user/application/enums'
import { ActionType, ResourceType, ScopeType } from '@prisma/client'

export interface PermissionPersistence {
  id: string | null
  specific_scope_id: string

  resource: AppResourceType | ResourceType
  action: AppActionType | ActionType
  scope: AppScopeType | ScopeType

  created_at: Date
  created_by: string
  updated_at: Date
  updated_by: string
  deleted_at: Date
  deleted_by: string
}
