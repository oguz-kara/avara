import { PaginatedResponseMeta } from './pagination.type'

export type PaginatedItemsResponse<T> = {
  items: T[]
  pagination: PaginatedResponseMeta
}
