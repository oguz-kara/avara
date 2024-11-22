import {
  ResourceType as AppResourceType,
  ActionType as AppActionType,
  ScopeType as AppScopeType,
} from '@avara/core/domain/user/application/enums'
import { ActionType, ResourceType, ScopeType } from '@prisma/client'

export interface PermissionPersistence {
  id: string | null
  specificScopeId: string

  resource: AppResourceType | ResourceType
  action: AppActionType | ActionType
  scope: AppScopeType | ScopeType

  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
  deletedAt: Date
  deletedBy: string
}
