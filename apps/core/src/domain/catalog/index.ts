import { ProductResolver } from './api/graphql/resolvers/product.resolver'
import { ProductService } from './application/services/product.service'
import { ProductRepository } from './infrastructure/repositories/product.repository'

export const CatalogProviders = [
  ProductService,
  ProductRepository,
  ProductResolver,
]
