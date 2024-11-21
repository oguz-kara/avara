import { Permission } from './permission.entity'
import { SoftDeletableEntity } from '@avara/shared/domain/soft-deletable-entity.interface'
import { TrackableEntity } from '@avara/shared/domain/trackable-entity.interface'
import { Channel } from '@avara/core/domain/channel/domain/entities/channel.entity'
import { ChannelListAwareEntity } from '@avara/core/domain/channel/domain/entities/channel-list-aware.entity'

export interface RoleProps {
  id: string
  name: string
  permissions?: Permission[]
  channels?: Channel[]
  updated_by?: string
  created_by?: string
  deleted_by?: string
  deleted_at?: Date
  created_at?: Date
  updated_at?: Date
}

export class Role
  extends ChannelListAwareEntity
  implements TrackableEntity, SoftDeletableEntity
{
  protected _channels?: Channel[]
  private _name: string
  private _permissions?: Permission[] = []
  protected readonly _created_at: Date
  protected _updated_at: Date
  private _deleted_at: Date | undefined = undefined
  private _deleted_by: string = undefined
  private _updated_by: string
  private _created_by: string

  constructor({
    id,
    name,
    permissions = [],
    channels = [],
    updated_by = 'system',
    created_by = 'system',
    deleted_by = undefined,
    deleted_at = undefined,
    created_at = new Date(),
    updated_at = new Date(),
  }: RoleProps) {
    super()
    this._id = id
    this._name = name
    this._channels = channels
    this._permissions = permissions
    this._updated_by = updated_by
    this._created_by = created_by
    this._deleted_by = deleted_by
    this._deleted_at = deleted_at
    this._created_at = created_at
    this._updated_at = updated_at
  }

  get name(): string {
    return this._name
  }

  get channels(): Channel[] {
    return this._channels
  }

  get permissions(): Permission[] {
    return [...this._permissions]
  }

  get created_at(): Date {
    return this._created_at
  }

  get updated_at(): Date {
    return this._updated_at
  }

  get created_by(): string {
    return this._created_by
  }

  get updated_by(): string {
    return this._updated_by
  }

  get deleted_at(): Date {
    return this._deleted_at
  }

  get deleted_by(): string {
    return this._deleted_by
  }

  public assignId(id: string): void {
    this._id = id
  }

  public assignPermission(permission: Permission): void {
    if (!this.hasPermission(permission)) {
      this._permissions.push(permission)
      this._updated_at = new Date()
    }
  }

  public setPermissions(permission: Permission[]): void {
    this._permissions = [...permission]
  }

  public removePermission(permission: Permission): void {
    this._permissions = this._permissions.filter((p) => p !== permission)
    this._updated_at = new Date()
  }

  public hasPermission(permission: Permission): boolean {
    return this._permissions.some((p) => p === permission)
  }

  public renameRole(newName: string): void {
    this._name = newName
    this._updated_at = new Date()
  }

  public softDelete(): void {
    if (this._deleted_at) throw new Error('Role already soft removed!')

    this._deleted_at = new Date()
  }

  public recover(): void {
    this._deleted_at = undefined
  }
}
