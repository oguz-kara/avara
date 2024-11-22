export abstract class CoreEntity {
  protected _id: string | undefined
  protected _createdAt: Date = new Date()
  protected _updatedAt: Date = new Date()

  get id(): string {
    return this._id
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  assignId(id: string): void {
    this._id = id
  }
}
