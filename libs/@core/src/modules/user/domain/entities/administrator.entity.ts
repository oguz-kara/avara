import { CoreEntity } from '@avara/shared/domain/core-entity.abstract'
import { SoftDeletableEntity } from '@avara/shared/domain/soft-deletable-entity.interface'
import { TrackableEntity } from '@avara/shared/domain/trackable-entity.interface'
import { ID } from '@avara/shared/types/id.type'
import { User } from './user.entity'

interface AdministratorProps {
  id: ID

  email: string

  user: User

  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
  deleted_at?: Date
  deleted_by?: string
}

export class Administrator
  extends CoreEntity
  implements TrackableEntity, SoftDeletableEntity
{
  protected _id: ID | undefined
  private _email: string
  private _user: User
  protected _created_at: Date
  private _created_by: string
  protected _updated_at: Date
  private _updated_by: string
  private _deleted_at: Date | undefined = undefined
  private _deleted_by: string | undefined = undefined

  constructor({
    id = undefined,
    email,
    user,
    created_at,
    created_by,
    updated_at,
    updated_by,
    deleted_at,
    deleted_by,
  }: AdministratorProps) {
    super()
    this._id = id
    this._email = email
    this._user = user
    this._created_at = created_at
    this._created_by = created_by
    this._updated_at = updated_at
    this._updated_by = updated_by
    this._deleted_at = deleted_at
    this._deleted_by = deleted_by
  }

  get id(): ID | undefined {
    return this._id
  }

  get email(): string {
    return this._email
  }

  get user(): User {
    return this._user
  }

  get created_at(): Date {
    return this._created_at
  }

  get created_by(): string {
    return this._created_by
  }

  get updated_at(): Date {
    return this._updated_at
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

  public softDelete(deleted_by: string): void {
    if (this._deleted_at) throw new Error('Role already soft removed!')

    this._deleted_at = new Date()
    this._deleted_by = deleted_by
  }

  public softRecover(): void {
    if (!this._deleted_at) throw new Error('Role already recovered!')

    this._deleted_at = undefined
    this._deleted_by = undefined
  }

  public assignId(id: string): void {
    this._id = id
  }

  set email(email: string) {
    this._email = email
  }
}
