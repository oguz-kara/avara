import { CoreEntity } from '@avara/shared/domain/core-entity.abstract'
import { SoftDeletableEntity } from '@avara/shared/domain/soft-deletable-entity.interface'
import { TrackableEntity } from '@avara/shared/domain/trackable-entity.interface'

interface ProductCategoryProps {
  id?: string
  parent_category_id?: string
  meta_field_id?: string
  name: string
  mdx_content: string
  created_at?: Date
  created_by?: string
  updated_at?: Date
  updated_by?: string
  deleted_at?: Date
  deleted_by?: string
}

export class ProductCategory
  extends CoreEntity
  implements TrackableEntity, SoftDeletableEntity
{
  _id: string | undefined
  private _parent_category_id: string
  private _meta_field_id: string
  private _name: string
  private _mdx_content: string
  protected _created_at: Date
  private _created_by: string
  protected _updated_at: Date
  private _updated_by: string
  private _deleted_at: Date | undefined = undefined
  private _deleted_by: string | undefined = undefined

  constructor({
    id = undefined,
    parent_category_id,
    meta_field_id,
    name,
    mdx_content,
    created_at = new Date(),
    created_by = 'system',
    updated_at = new Date(),
    updated_by = 'system',
    deleted_at = undefined,
    deleted_by = undefined,
  }: ProductCategoryProps) {
    super()
    this._id = id
    this._parent_category_id = parent_category_id
    this._meta_field_id = meta_field_id
    this._name = name
    this._mdx_content = mdx_content
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

  get parent_category_id(): string {
    return this._parent_category_id
  }

  get meta_field_id(): string {
    return this._meta_field_id
  }

  get name(): string {
    return this._name
  }

  get mdx_content(): string {
    return this._mdx_content
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

  public softRecover(): void {
    this._deleted_at = undefined
  }

  public assignId(id: string): void {
    this._id = id
  }

  public deleteProductCategory() {
    this._deleted_at = new Date()
  }

  public renameProductCategory(name: string) {
    this._name = name
  }
}
