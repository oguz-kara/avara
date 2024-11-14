import { CoreEntity } from '@avara/shared/domain/core-entity.abstract'
import { SoftDeletableEntity } from '@avara/shared/domain/soft-deletable-entity.interface'
import { TrackableEntity } from '@avara/shared/domain/trackable-entity.interface'

export interface RolePermissionProps {
  id?: string
  role_id: string
  permission_id: string
  is_active: boolean
  created_by?: string
  updated_by?: string
  created_at?: Date
  updated_at?: Date
  deleted_at?: Date
  deleted_by?: string
}

export class RolePermission
  extends CoreEntity
  implements TrackableEntity, SoftDeletableEntity
{
  private _role_id: string
  private _permission_id: string
  private _is_active: boolean
  private _created_by: string = 'system'
  private _updated_by: string = 'system'
  private _deleted_at: Date | undefined
  private _deleted_by: string | undefined
  private _specific_scope_id: string

  constructor({
    id,
    role_id,
    permission_id,
    is_active,
    created_by = 'system',
    updated_by = 'system',
    created_at = undefined,
    updated_at = undefined,
    deleted_at = undefined,
    deleted_by = undefined,
  }: RolePermissionProps) {
    super()
    this._id = id
    this._role_id = role_id
    this._permission_id = permission_id
    this._is_active = is_active
    this._created_at = created_at
    this._created_by = created_by
    this._updated_at = updated_at
    this._updated_by = updated_by
    this._deleted_at = deleted_at
    this._deleted_by = deleted_by
  }

  get role_id(): string {
    return this._role_id
  }

  get permission_id(): string {
    return this._permission_id
  }

  get is_active(): boolean {
    return this._is_active
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

  public softDelete(): void {
    if (this._deleted_at)
      throw new Error('Role permission already soft removed!')

    this._deleted_at = new Date()
  }

  public softRecover(): void {
    this._deleted_at = undefined
  }
}
