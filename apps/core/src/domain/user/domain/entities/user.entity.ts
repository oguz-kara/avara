import { UserActiveStatus } from '../enums/user-active-status.enum'
import { CoreEntity } from '@avara/shared/domain/core-entity.abstract'
import { SoftDeletableEntity } from '@avara/shared/domain/soft-deletable-entity.interface'
import { TrackableEntity } from '@avara/shared/domain/trackable-entity.interface'

interface UserProps {
  id?: string
  email: string
  passwordHash: string
  emailVerified?: boolean
  roleId: string
  isActive?: UserActiveStatus
  createdAt?: Date
  createdBy?: string
  updatedAt?: Date
  updatedBy?: string
  deletedAt?: Date
  deletedBy?: string
}

export class User
  extends CoreEntity
  implements TrackableEntity, SoftDeletableEntity
{
  _id: string | undefined
  private _email: string
  private _passwordHash: string
  private _emailVerified: boolean
  private _isActive: UserActiveStatus
  private _roleId: string
  protected _createdAt: Date
  private _createdBy: string
  protected _updatedAt: Date
  private _updatedBy: string
  private _deletedAt: Date | undefined = undefined
  private _deletedBy: string | undefined = undefined

  constructor({
    id = undefined,
    email,
    passwordHash,
    emailVerified = false,
    roleId,
    isActive = UserActiveStatus.INACTIVE,
    createdAt = new Date(),
    createdBy = 'system',
    updatedAt = new Date(),
    updatedBy = 'system',
    deletedAt = undefined,
    deletedBy = undefined,
  }: UserProps) {
    super()
    this._id = id
    this._email = email
    this._passwordHash = passwordHash
    this._emailVerified = emailVerified
    this._isActive = isActive
    this._roleId = roleId
    this._createdAt = createdAt
    this._updatedAt = updatedAt
    this._deletedAt = deletedAt
    this._createdBy = createdBy
    this._updatedBy = updatedBy
    this._deletedBy = deletedBy
  }

  get id(): string {
    return this._id
  }

  get email(): string {
    return this._email
  }

  get passwordHash(): string {
    return this._passwordHash
  }

  get roleId(): string {
    return this._roleId
  }

  get isActive(): string {
    return this._isActive
  }

  get emailVerified(): boolean {
    return this._emailVerified
  }

  get createdAt(): Date {
    return new Date(this._createdAt)
  }

  get updatedAt(): Date {
    return new Date(this._updatedAt)
  }

  get deletedAt(): Date | undefined {
    return this._deletedAt ? new Date(this._deletedAt) : undefined
  }

  get deletedBy(): string {
    return this._deletedBy
  }

  get createdBy(): string {
    return this._createdBy
  }

  get updatedBy(): string {
    return this._updatedBy
  }

  public softDelete(): void {
    if (this._deletedAt) throw new Error('Role already soft removed!')

    this._deletedAt = new Date()
  }

  public recover(): void {
    this._deletedAt = undefined
  }

  public assignId(id: string): void {
    this._id = id
  }

  public changeEmail(newEmail: string): void {
    if (this._emailVerified) {
      throw new Error('Cannot change email after verification.')
    }
    if (!this.validateEmail(newEmail)) {
      throw new Error('Invalid email format.')
    }
    this._email = newEmail
    this._updatedAt = new Date()
  }

  public changePassword(newPasswordHash: string) {
    this._passwordHash = newPasswordHash
  }

  public setRole(newRoleId: string) {
    this._roleId = newRoleId
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}
