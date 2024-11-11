import { RequestContext } from '@avara/core/context/request-context'
import {
  PaginatedList,
  PaginationParams,
} from '@avara/core/modules/user/api/types/pagination.type'

export interface ChannelResourceFinder<T> {
  findOneInChannel(resourceId: string): Promise<T | null>
  findManyInChannel(args: PaginationParams): Promise<PaginatedList<T>>
}

export interface ChannelResourceCreator<T> {
  createResourcesInChannel(resources: T[]): Promise<void>
}

export interface ChannelResourceEditor<T> {
  editResourcesInChannel(resources: T[]): Promise<void>
}

export interface ChannelResourceRemover<T> {
  removeResourceInChannel(resource: T): Promise<void>
}

export interface ChannelResourcesRemover<T> {
  removeResourcesInChannel(resources: T[]): Promise<void>
}

export interface ChannelResourceSaver<T> {
  saveResourceToChannel(record: T | T[]): Promise<void>
}

export abstract class ContextSaver {
  private _ctx: RequestContext

  saveContext(ctx: RequestContext): void {
    this._ctx = ctx
  }

  get ctx(): RequestContext {
    return this._ctx
  }
}
