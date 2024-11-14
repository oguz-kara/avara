import { Mappers } from './infrastructure/mappers'
import { Repositories } from './infrastructure/orm/repository'
import { Services } from './application/services'
import { Resolvers } from './api/graphql'
import { UserInfraServices } from './infrastructure/services'

export const UserProviders = [
  ...Resolvers,
  ...Services,
  ...Repositories,
  ...Mappers,
  ...UserInfraServices,
]
