import { Injectable } from '@nestjs/common'
import { CategoryRepository } from './modules/category/infrastructure/repositories/category.repository'
import { SeoMetadataRepository } from './modules/seo-metadata/infrastructure/repositories/seo-metadata.repository'
import { RequestContext } from '@avara/core/context/request-context'

type EntityRepositoryMap = {
  Category: CategoryRepository
  SeoMetadata: SeoMetadataRepository
}

@Injectable()
export class SharedRepositories {
  private readonly repositories = new Map<
    keyof EntityRepositoryMap,
    EntityRepositoryMap[keyof EntityRepositoryMap]
  >()

  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly seoMetadataRepository: SeoMetadataRepository,
  ) {
    this.repositories.set('Category', categoryRepository)
    this.repositories.set('SeoMetadata', seoMetadataRepository)
  }

  get<E extends keyof EntityRepositoryMap>(
    ctx: RequestContext,
    entity: E,
  ): EntityRepositoryMap[E] {
    const repository = this.repositories.get(entity) as EntityRepositoryMap[E]
    if (!repository) {
      throw new Error(`Repository for ${entity} not found`)
    }
    repository.saveContext(ctx)
    return repository
  }
}
