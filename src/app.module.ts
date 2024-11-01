import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule } from '@nestjs/config'
import { appConfig } from '@avara/core/modules/user/config/app.config'
import { SharedModule } from '@avara/shared/shared.module'
import { CoreModule } from '@avara/core/core.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      installSubscriptionHandlers: true,
      autoSchemaFile: true,
      driver: ApolloDriver,
      formatError: (error) => {
        const originalError = error.extensions?.originalError as Error

        if (!originalError) {
          return {
            message: error.message,
            code: error.extensions?.code,
          }
        }
        return {
          message: originalError.message,
          code: error.extensions?.code,
        }
      },
    }),
    CoreModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
