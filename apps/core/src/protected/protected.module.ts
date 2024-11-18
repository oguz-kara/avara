import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { SharedModule } from '@avara/shared/shared.module'
import { getGqlContextHandler } from './context/handle-gql-context'
import { ChannelService } from '@avara/core/domain/channel/application/services/channel.service'
import { APP_GUARD } from '@nestjs/core'
import { PermissionsGuard } from '../application/guards/permission.guard'
import { JwtModule } from '@nestjs/jwt'
import { CoreRepositories } from '../application/core-repositories'
import { UserProviders } from '../domain/user'
import { CategoryProviders } from '../domain/category'
import { ChannelModule, ChannelProviders } from '../domain/channel'
import { SeoMetadataProviders } from '../domain/seo-metadata'
import { AssetControllers, AssetProviders } from '../domain/asset'
import { RestContextMiddleware } from '../middleware'
import { GqlExceptionFilter } from '@avara/shared/exception-filter/gql-exception-filter'

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
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule, ChannelModule],
      inject: [ConfigService, ChannelService],
      driver: ApolloDriver,
      useFactory: async (
        configService: ConfigService,
        channelService: ChannelService,
      ) => ({
        context: getGqlContextHandler(configService, channelService),
        installSubscriptionHandlers: true,
        autoSchemaFile: true,
        path: configService.get<string>('apiPaths.protected', '/protected'),
        formatError: (error) => {
          const originalError = error.extensions?.originalError as Error
          return originalError
            ? { message: originalError.message, code: error.extensions?.code }
            : { message: error.message, code: error.extensions?.code }
        },
      }),
    }),
    SharedModule,
  ],
  controllers: [...AssetControllers],
  providers: [
    CoreRepositories,
    ...UserProviders,
    ...CategoryProviders,
    ...ChannelProviders,
    ...SeoMetadataProviders,
    ...ChannelProviders,
    ...AssetProviders,
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: 'APP_FILTER',
      useClass: GqlExceptionFilter,
    },
  ],
  exports: [
    CoreRepositories,
    ...UserProviders,
    ...CategoryProviders,
    ...ChannelProviders,
    ...SeoMetadataProviders,
    ...ChannelProviders,
  ],
})
export class ProtectedModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RestContextMiddleware)
      .forRoutes({ path: 'assets*', method: RequestMethod.ALL })
  }
}
