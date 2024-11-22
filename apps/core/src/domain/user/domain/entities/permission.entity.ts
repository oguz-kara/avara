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
  createdBy?: string
  updatedBy?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  deletedBy?: string
  specificScopeId?: string
}

export class Permission
  extends ChannelListAwareEntity
  implements TrackableEntity, SoftDeletableEntity
{
  private _resource: ResourceType
  private _action: ActionType
  private _scope: ScopeType
  private _createdBy: string = 'system'
  private _updatedBy: string = 'system'
  private _deletedAt: Date | undefined
  private _deletedBy: string | undefined
  private _specificScopeId: string

  constructor({
    id,
    resource,
    action,
    scope,
    createdBy = 'system',
    updatedBy = 'system',
    createdAt = new Date(),
    updatedAt = new Date(),
    deletedAt = undefined,
    deletedBy = undefined,
    specificScopeId = null,
  }: PermissionProps) {
    super()
    this._id = id
    this._resource = resource
    this._action = action
    this._scope = scope
    this._createdAt = createdAt
    this._createdBy = createdBy
    this._updatedAt = updatedAt
    this._updatedBy = updatedBy
    this._deletedAt = deletedAt
    this._deletedBy = deletedBy
    this._specificScopeId = specificScopeId
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
  get createdBy(): string {
    return this._createdBy
  }
  get updatedBy(): string {
    return this._updatedBy
  }
  get deletedAt(): Date | undefined {
    return this._deletedAt
  }
  get deletedBy(): string | undefined {
    return this._deletedBy
  }
  get specificScopeId(): string {
    return this._specificScopeId
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
    if (id === this._specificScopeId) return
    this._specificScopeId = id
  }

  public softDelete(): void {
    if (this._deletedAt) throw new Error('Permission already soft removed!')

    this._deletedAt = new Date()
  }

  public recover(): void {
    this._deletedAt = undefined
  }
}
