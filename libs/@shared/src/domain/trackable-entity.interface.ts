export interface TrackableEntity {
  get created_by(): string
  get updated_by(): string
}
