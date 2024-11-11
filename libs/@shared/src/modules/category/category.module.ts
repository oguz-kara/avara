import { Module } from '@nestjs/common'
import { Resolvers } from './api/graphql'
import { Repositories } from './infrastructure/repositories'
import { Services } from './application/services'
import { Mappers } from './infrastructure/mappers'

@Module({
  imports: [],
  providers: [...Resolvers, ...Services, ...Mappers, ...Repositories],
  exports: [...Repositories],
})
export class CategoryModule {}
