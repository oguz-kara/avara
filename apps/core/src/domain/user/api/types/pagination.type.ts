export interface PaginationMetaResponse
  extends PaginationMeta,
    PaginationParams {
  totalPages: number
}

export type PaginationParams = {
  limit?: number
  position?: number
}

export type PaginationMeta = {
  total: number
}

export type PaginatedList<T> = {
  items: T[]
  pagination: PaginatedResponseMeta
}

export type PaginatedResponseMeta = PaginationParams & PaginationMeta
