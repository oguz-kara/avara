import { Module } from '@nestjs/common'
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
  controllers: [],
  providers: [
    CoreRepositories,
    ...UserProviders,
    ...CategoryProviders,
    ...ChannelProviders,
    ...SeoMetadataProviders,
    ...ChannelProviders,
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
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
export class ProtectedModule {}
