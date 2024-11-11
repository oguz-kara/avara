import { Module } from '@nestjs/common'
import { Mappers } from './infrastructure/mappers'
import { Repositories } from './infrastructure/orm/repository'
import { Services } from './application/services'
import { Resolvers } from './api/graphql'
import { PaginationUtils } from '../../../../@shared/src/utils/pagination.util'
import { DbService } from '../../../../@shared/src/database/db-service'
import { BcryptHasherService } from './infrastructure/services/bcryp-hasher.service'
import { PasswordService } from './infrastructure/services/password.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtStrategy } from './infrastructure/auth-strategies/jwt.strategy'
import { ChannelModule } from '@avara/shared/modules/channel/channel.module'
import { CoreRepositories } from '@avara/core/core-repositories'

@Module({
  imports: [
    ConfigModule,
    ChannelModule,
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
    JwtStrategy,
    CoreRepositories,
  ],
  exports: [...Repositories, ...Services],
})
export class UserModule {}
