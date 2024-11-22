export interface SoftDeletableEntity {
  get deletedAt(): Date | undefined
  get deletedBy(): string | undefined

  softDelete(deletedBy: string): void
  recover(): void
}
