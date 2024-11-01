import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/modules/user/api/types/pagination.type'

export interface Repository<T> {
  findById(resourceId: string): Promise<T | null>
  findAll(args: PaginationParams): Promise<PaginatedList<T>>
  remove(resourceId: string): Promise<T | null>
  save(record: T): Promise<void>
}
