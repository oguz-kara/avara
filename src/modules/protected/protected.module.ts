import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CoreModule } from '@avara/core/core.module'
import { SharedModule } from '@avara/shared/shared.module'
import { getGqlContextHandler } from './context/handle-gql-context'
import { ChannelService } from '@avara/shared/modules/channel/application/services/channel.service'
import { ChannelModule } from '@avara/shared/modules/channel/channel.module'

@Module({
  imports: [
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
    CoreModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class ProtectedModule {}
