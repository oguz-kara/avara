import { Module } from '@nestjs/common'
import { Mappers } from './infrastructure/mappers'
import { Repositories } from './infrastructure/orm/repository'
import { Services } from './application/services'
import { Resolvers } from './api/graphql'
import { PaginationUtils } from './application/utils/pagination.util'
import { DbService } from '../../../../@shared/src/database/db-service'
import { BcryptHasherService } from './infrastructure/services/bcryp-hasher.service'
import { PasswordService } from './infrastructure/services/password.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [
    ...Resolvers,
    ...Services,
    ...Repositories,
    ...Mappers,
    PaginationUtils,
    DbService,
    BcryptHasherService,
    PasswordService,
  ],
  exports: [...Repositories, ...Services],
})
export class UserModule {}
