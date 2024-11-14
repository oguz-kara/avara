import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { appConfig } from './domain/user/config/app.config'
import { ProtectedModule } from './protected/protected.module'
import { ContextMiddleware } from './middleware'
import { SharedModule } from '@avara/shared/shared.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    ProtectedModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('*')
  }
}
