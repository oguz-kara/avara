import { PaginatedList } from '@avara/core/domain/user/api/types/pagination.type'
import { PaginationParams } from '@avara/core/domain/user/api/types/pagination.type'
import { RequestContext } from '../application/context/request-context'
import { DbTransactionalClient } from '@avara/shared/database/db-transactional-client'

export interface PersistenceContext {
  tx?: DbTransactionalClient | null
  relations?: Record<string, object | boolean>
}

export interface ChannelResourceFinder<T> {
  findOneInChannel(
    resourceId: string,
    context?: PersistenceContext,
  ): Promise<T | null>
  findManyInChannel(
    args: PaginationParams,
    context: PersistenceContext,
  ): Promise<PaginatedList<T>>
}

export interface ChannelResourceCreator<T> {
  createResourcesInChannel(
    resources: T[],
    context?: PersistenceContext,
  ): Promise<void>
}

export interface ChannelResourceEditor<T> {
  editResourcesInChannel(
    resources: T[],
    context?: PersistenceContext,
  ): Promise<void>
}

export interface ChannelResourceRemover<T> {
  removeResourceInChannel(
    resource: T,
    context?: PersistenceContext,
  ): Promise<void>
}

export interface ChannelResourcesRemover<T> {
  removeResourcesInChannel(
    resources: T[],
    context?: PersistenceContext,
  ): Promise<void>
}

export interface ChannelResourceSaver<T> {
  saveResourceToChannel(
    record: T | T[],
    context?: PersistenceContext,
  ): Promise<void>
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
