import { Services } from './application/services'
import { Resolvers } from './api/graphql/resolvers'
import { Repositories } from './infrastructure/repositories'
import { Mappers } from './infrastructure/mappers'

export const SeoMetadataProviders = [
  ...Resolvers,
  ...Services,
  ...Repositories,
  ...Mappers,
]
