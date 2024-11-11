import { ID } from '../types/id.type'

export interface BaseService<E> {
  getById(resourceId: string): Promise<E | null>
  getAll<A, R>(args: A): Promise<R>
  remove(resourceId: string): Promise<any | null>
  edit(id: ID, data: E): Promise<E>
}
