import {
  ActionType,
  ResourceType,
  ScopeType,
} from '@avara/core/domain/user/application/enums'
import { TrackableEntity } from '@avara/shared/domain/trackable-entity.interface'
import { SoftDeletableEntity } from '@avara/shared/domain/soft-deletable-entity.interface'
import {
  PermissionArray,
  PermissionString,
} from '@avara/core/domain/user/api/types/permission.types'
import { ChannelListAwareEntity } from '@avara/core/domain/channel/domain/entities/channel-list-aware.entity'

export interface PermissionProps {
  id?: string
  resource: ResourceType
  action: ActionType
  scope: ScopeType
  created_by?: string
  updated_by?: string
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date
  deleted_by?: string
  specific_scope_id?: string
}

export class Permission
  extends ChannelListAwareEntity
  implements TrackableEntity, SoftDeletableEntity
{
  private _resource: ResourceType
  private _action: ActionType
  private _scope: ScopeType
  private _created_by: string = 'system'
  private _updated_by: string = 'system'
  private _deleted_at: Date | undefined
  private _deleted_by: string | undefined
  private _specific_scope_id: string

  constructor({
    id,
    resource,
    action,
    scope,
    created_by = 'system',
    updated_by = 'system',
    created_at = new Date(),
    updated_at = new Date(),
    deleted_at = undefined,
    deleted_by = undefined,
    specific_scope_id = null,
  }: PermissionProps) {
    super()
    this._id = id
    this._resource = resource
    this._action = action
    this._scope = scope
    this._created_at = created_at
    this._created_by = created_by
    this._updated_at = updated_at
    this._updated_by = updated_by
    this._deleted_at = deleted_at
    this._deleted_by = deleted_by
    this._specific_scope_id = specific_scope_id
  }

  get resource(): ResourceType {
    return this._resource
  }
  get action(): ActionType {
    return this._action
  }
  get scope(): ScopeType {
    return this._scope
  }
  get created_by(): string {
    return this._created_by
  }
  get updated_by(): string {
    return this._updated_by
  }
  get deleted_at(): Date | undefined {
    return this._deleted_at
  }
  get deleted_by(): string | undefined {
    return this._deleted_by
  }
  get specific_scope_id(): string {
    return this._specific_scope_id
  }

  get name(): PermissionString {
    return `${this._action}:${this._resource}:${this._scope}`
  }

  public renamePermission(name: PermissionString): void {
    const [action, resource, scope] = name.split(':') as PermissionArray
    this._resource = resource as ResourceType
    this._action = action as ActionType
    this._scope = scope as ScopeType
  }

  public assignSpecificScopeId(id: string): void {
    if (id === this._specific_scope_id) return
    this._specific_scope_id = id
  }

  public softDelete(): void {
    if (this._deleted_at) throw new Error('Permission already soft removed!')

    this._deleted_at = new Date()
  }

  public recover(): void {
    this._deleted_at = undefined
  }
}
