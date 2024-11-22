import { CoreEntity } from '@avara/shared/domain/core-entity.abstract'
import { SoftDeletableEntity } from '@avara/shared/domain/soft-deletable-entity.interface'
import { TrackableEntity } from '@avara/shared/domain/trackable-entity.interface'
import { CategoryType } from '../../application/enums/category.enum'

interface CategoryProps {
  id?: string
  parentCategoryId?: string
  metaFieldId?: string
  categoryType: CategoryType
  name: string
  content: string
  contentType: string
  createdAt?: Date
  createdBy?: string
  updatedAt?: Date
  updatedBy?: string
  deletedAt?: Date
  deletedBy?: string
}

export class Category
  extends CoreEntity
  implements TrackableEntity, SoftDeletableEntity
{
  _id: string | undefined
  private _parentCategoryId: string
  private _metaFieldId: string
  private _categoryType: CategoryType
  private _name: string
  private _content: string
  private _contentType: string
  protected _createdAt: Date
  private _createdBy: string
  protected _updatedAt: Date
  private _updatedBy: string
  private _deletedAt: Date | undefined = undefined
  private _deletedBy: string | undefined = undefined

  constructor({
    id = undefined,
    parentCategoryId,
    metaFieldId,
    categoryType,
    name,
    content,
    contentType,
    createdAt = new Date(),
    createdBy = 'system',
    updatedAt = new Date(),
    updatedBy = 'system',
    deletedAt = undefined,
    deletedBy = undefined,
  }: CategoryProps) {
    super()
    this._id = id
    this._categoryType = categoryType
    this._parentCategoryId = parentCategoryId
    this._metaFieldId = metaFieldId
    this._name = name
    this._contentType = contentType
    this._content = content
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

  get parentCategoryId(): string {
    return this._parentCategoryId
  }

  get metaFieldId(): string {
    return this._metaFieldId
  }

  get name(): string {
    return this._name
  }

  get content(): string {
    return this._content
  }

  get contentType(): string {
    return this._contentType
  }

  get categoryType(): CategoryType {
    return this._categoryType
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

  public deleteProductCategory() {
    this._deletedAt = new Date()
  }

  public renameProductCategory(name: string) {
    this._name = name
  }
}
