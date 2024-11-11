import { Module } from '@nestjs/common'
import { Resolvers } from './api/graphql/resolvers'
import { Services } from './application/services'
import { Repositories } from './infrastructure/repositories'
import { Mappers } from './infrastructure/mappers'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [...Resolvers, ...Services, ...Repositories, ...Mappers],
  exports: [...Repositories, ...Services, ...Mappers, ...Repositories],
})
export class ChannelModule {}
