import { ActionType } from '../../application/enums/action-type.enum'
import { ResourceType } from '../../application/enums/resource-type.enum'
import { ScopeType } from '../../application/enums/scope-type.enum'

type ActionString = `${ActionType}`
type ResourceString = `${ResourceType}`
type ScopeString = `${ScopeType}`

export type PermissionString =
  `${ActionString}:${ResourceString}:${ScopeString}`

export type PermissionArray = [ActionString, ResourceString, ScopeString]
