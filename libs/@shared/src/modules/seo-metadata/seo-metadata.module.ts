import { ConfigModule } from '@nestjs/config'
import { Services } from './application/services'
import { Resolvers } from './api/graphql/resolvers'
import { Repositories } from './infrastructure/repositories'
import { Mappers } from './infrastructure/mappers'
import { Module } from '@nestjs/common'

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [...Resolvers, ...Services, ...Repositories, ...Mappers],
  exports: [...Repositories, ...Services, ...Mappers, ...Repositories],
})
export class SeoMetadataModule {}
