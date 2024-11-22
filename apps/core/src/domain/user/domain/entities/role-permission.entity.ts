import { CoreEntity } from '@avara/shared/domain/core-entity.abstract'
import { SoftDeletableEntity } from '@avara/shared/domain/soft-deletable-entity.interface'
import { TrackableEntity } from '@avara/shared/domain/trackable-entity.interface'

export interface RolePermissionProps {
  id?: string
  roleId: string
  permissionId: string
  isActive: boolean
  createdBy?: string
  updatedBy?: string
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
  deletedBy?: string
}

export class RolePermission
  extends CoreEntity
  implements TrackableEntity, SoftDeletableEntity
{
  private _roleId: string
  private _permissionId: string
  private _isActive: boolean
  private _createdBy: string = 'system'
  private _updatedBy: string = 'system'
  private _deletedAt: Date | undefined
  private _deletedBy: string | undefined
  private _specificScopeId: string

  constructor({
    id,
    roleId,
    permissionId,
    isActive,
    createdBy = 'system',
    updatedBy = 'system',
    createdAt = undefined,
    updatedAt = undefined,
    deletedAt = undefined,
    deletedBy = undefined,
  }: RolePermissionProps) {
    super()
    this._id = id
    this._roleId = roleId
    this._permissionId = permissionId
    this._isActive = isActive
    this._createdAt = createdAt
    this._createdBy = createdBy
    this._updatedAt = updatedAt
    this._updatedBy = updatedBy
    this._deletedAt = deletedAt
    this._deletedBy = deletedBy
  }

  get roleId(): string {
    return this._roleId
  }

  get permissionId(): string {
    return this._permissionId
  }

  get isActive(): boolean {
    return this._isActive
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

  public softDelete(): void {
    if (this._deletedAt)
      throw new Error('Role permission already soft removed!')

    this._deletedAt = new Date()
  }

  public recover(): void {
    this._deletedAt = undefined
  }
}
