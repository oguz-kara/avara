import { UserActiveStatus } from '../enums/user-active-status.enum'
import { CoreEntity } from '@avara/shared/domain/core-entity.abstract'
import { SoftDeletableEntity } from '@avara/shared/domain/soft-deletable-entity.interface'
import { TrackableEntity } from '@avara/shared/domain/trackable-entity.interface'

interface UserProps {
  id?: string
  email: string
  password_hash: string
  email_verified?: boolean
  role_id: string
  is_active?: UserActiveStatus
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
  deleted_at?: Date
  deleted_by?: string
}

export class User
  extends CoreEntity
  implements TrackableEntity, SoftDeletableEntity
{
  _id: string | undefined
  private _email: string
  private _password_hash: string
  private _email_verified: boolean
  private _is_active: UserActiveStatus
  private _role_id: string
  protected _created_at: Date
  private _created_by: string
  protected _updated_at: Date
  private _updated_by: string
  private _deleted_at: Date | undefined = undefined
  private _deleted_by: string | undefined = undefined

  constructor({
    id = undefined,
    email,
    password_hash,
    email_verified = false,
    role_id,
    is_active = UserActiveStatus.INACTIVE,
    created_at = new Date(),
    created_by = 'system',
    updated_at = new Date(),
    updated_by = 'system',
    deleted_at = undefined,
    deleted_by = undefined,
  }: UserProps) {
    super()
    this._id = id
    this._email = email
    this._password_hash = password_hash
    this._email_verified = email_verified
    this._is_active = is_active
    this._role_id = role_id
    this._created_at = created_at
    this._updated_at = updated_at
    this._deleted_at = deleted_at
    this._created_by = created_by
    this._updated_by = updated_by
    this._deleted_by = deleted_by
  }

  get id(): string {
    return this._id
  }

  get email(): string {
    return this._email
  }

  get password_hash(): string {
    return this._password_hash
  }

  get role_id(): string {
    return this._role_id
  }

  get is_active(): string {
    return this._is_active
  }

  get email_verified(): boolean {
    return this._email_verified
  }

  get created_at(): Date {
    return new Date(this._created_at)
  }

  get updated_at(): Date {
    return new Date(this._updated_at)
  }

  get deleted_at(): Date | undefined {
    return this._deleted_at ? new Date(this._deleted_at) : undefined
  }

  get deleted_by(): string {
    return this._deleted_by
  }

  get created_by(): string {
    return this._created_by
  }

  get updated_by(): string {
    return this._updated_by
  }

  public softDelete(): void {
    if (this._deleted_at) throw new Error('Role already soft removed!')

    this._deleted_at = new Date()
  }

  public recover(): void {
    this._deleted_at = undefined
  }

  public assignId(id: string): void {
    this._id = id
  }

  public changeEmail(newEmail: string): void {
    if (this._email_verified) {
      throw new Error('Cannot change email after verification.')
    }
    if (!this.validateEmail(newEmail)) {
      throw new Error('Invalid email format.')
    }
    this._email = newEmail
    this._updated_at = new Date()
  }

  public changePassword(newPasswordHash: string) {
    this._password_hash = newPasswordHash
  }

  public setRole(newRoleId: string) {
    this._role_id = newRoleId
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
