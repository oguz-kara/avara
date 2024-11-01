export interface SoftDeletableEntity {
  get deleted_at(): Date | undefined
  get deleted_by(): string | undefined

  softDelete(deleted_by: string): void
  softRecover(): void
}
