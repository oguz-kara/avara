import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/user/api/types/pagination.type'

export interface Repository<T> {
  findOneById(resourceId: string): Promise<T | null>
  findMany(args: PaginationParams): Promise<PaginatedList<T>>
  remove(resource: T): Promise<void>
  save(record: T): Promise<void>
}
