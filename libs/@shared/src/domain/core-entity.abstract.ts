export abstract class CoreEntity {
  protected _id: string | undefined
  protected _created_at: Date = new Date()
  protected _updated_at: Date = new Date()

  get id(): string {
    return this._id
  }

  get created_at(): Date {
    return this._created_at
  }

  get updated_at(): Date {
    return this._updated_at
  }

  assignId(id: string): void {
    this._id = id
  }
}
