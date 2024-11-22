import { CoreEntity } from '@avara/shared/domain/core-entity.abstract'
import { SoftDeletableEntity } from '@avara/shared/domain/soft-deletable-entity.interface'
import { TrackableEntity } from '@avara/shared/domain/trackable-entity.interface'
import { ID } from '@avara/shared/types/id.type'
import { User } from './user.entity'

interface AdministratorProps {
  id: ID

  email: string

  user: User

  createdAt?: Date
  createdBy?: string
  updatedAt?: Date
  updatedBy?: string
  deletedAt?: Date
  deletedBy?: string
}

export class Administrator
  extends CoreEntity
  implements TrackableEntity, SoftDeletableEntity
{
  protected Id: ID | undefined
  private Email: string
  private User: User
  protected CreatedAt: Date
  private CreatedBy: string
  protected UpdatedAt: Date
  private UpdatedBy: string
  private DeletedAt: Date | undefined = undefined
  private DeletedBy: string | undefined = undefined

  constructor({
    id = undefined,
    email,
    user,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
    deletedAt,
    deletedBy,
  }: AdministratorProps) {
    super()
    this.Id = id
    this.Email = email
    this.User = user
    this.CreatedAt = createdAt
    this.CreatedBy = createdBy
    this.UpdatedAt = updatedAt
    this.UpdatedBy = updatedBy
    this.DeletedAt = deletedAt
    this.DeletedBy = deletedBy
  }

  get id(): ID | undefined {
    return this.Id
  }

  get email(): string {
    return this.Email
  }

  get user(): User {
    return this.User
  }

  get createdAt(): Date {
    return this.CreatedAt
  }

  get createdBy(): string {
    return this.CreatedBy
  }

  get updatedAt(): Date {
    return this.UpdatedAt
  }

  get updatedBy(): string {
    return this.UpdatedBy
  }

  get deletedAt(): Date | undefined {
    return this.DeletedAt
  }

  get deletedBy(): string | undefined {
    return this.DeletedBy
  }

  public softDelete(deletedBy: string): void {
    if (this.DeletedAt) throw new Error('Role already soft removed!')

    this.DeletedAt = new Date()
    this.DeletedBy = deletedBy
  }

  public recover(): void {
    if (!this.DeletedAt) throw new Error('Role already recovered!')

    this.DeletedAt = undefined
    this.DeletedBy = undefined
  }

  public assignId(id: string): void {
    this.Id = id
  }

  set email(email: string) {
    this.Email = email
  }
}
