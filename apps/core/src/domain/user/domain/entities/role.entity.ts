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
  updatedBy?: string
  createdBy?: string
  deletedBy?: string
  deletedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

export class Role
  extends ChannelListAwareEntity
  implements TrackableEntity, SoftDeletableEntity
{
  protected _channels?: Channel[]
  private _name: string
  private _permissions?: Permission[] = []
  protected readonly _createdAt: Date
  protected _updatedAt: Date
  private _deletedAt: Date | undefined = undefined
  private _deletedBy: string = undefined
  private _updatedBy: string
  private _createdBy: string

  constructor({
    id,
    name,
    permissions = [],
    channels = [],
    updatedBy = 'system',
    createdBy = 'system',
    deletedBy = undefined,
    deletedAt = undefined,
    createdAt = new Date(),
    updatedAt = new Date(),
  }: RoleProps) {
    super()
    this._id = id
    this._name = name
    this._channels = channels
    this._permissions = permissions
    this._updatedBy = updatedBy
    this._createdBy = createdBy
    this._deletedBy = deletedBy
    this._deletedAt = deletedAt
    this._createdAt = createdAt
    this._updatedAt = updatedAt
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

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  get createdBy(): string {
    return this._createdBy
  }

  get updatedBy(): string {
    return this._updatedBy
  }

  get deletedAt(): Date {
    return this._deletedAt
  }

  get deletedBy(): string {
    return this._deletedBy
  }

  public assignId(id: string): void {
    this._id = id
  }

  public assignPermission(permission: Permission): void {
    if (!this.hasPermission(permission)) {
      this._permissions.push(permission)
      this._updatedAt = new Date()
    }
  }

  public setPermissions(permission: Permission[]): void {
    this._permissions = [...permission]
  }

  public removePermission(permission: Permission): void {
    this._permissions = this._permissions.filter((p) => p !== permission)
    this._updatedAt = new Date()
  }

  public hasPermission(permission: Permission): boolean {
    return this._permissions.some((p) => p === permission)
  }

  public renameRole(newName: string): void {
    this._name = newName
    this._updatedAt = new Date()
  }

  public softDelete(): void {
    if (this._deletedAt) throw new Error('Role already soft removed!')

    this._deletedAt = new Date()
  }

  public recover(): void {
    this._deletedAt = undefined
  }
}
