import { Resolvers } from './api/graphql'
import { Services } from './application/services'
import { Mappers } from './infrastructure/mappers'
import { Repositories } from './infrastructure/repositories'

export const CategoryProviders = [
  ...Mappers,
  ...Repositories,
  ...Services,
  ...Resolvers,
]
