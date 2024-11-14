import { Module } from '@nestjs/common'
import { Resolvers } from './api/graphql/resolvers'
import { Services } from './application/services'
import { Repositories } from './infrastructure/repositories'
import { Mappers } from './infrastructure/mappers'

export const ChannelProviders = [
  ...Repositories,
  ...Services,
  ...Mappers,
  ...Resolvers,
]

@Module({
  providers: [...ChannelProviders],
  exports: [...ChannelProviders],
})
export class ChannelModule {}
