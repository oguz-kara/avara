import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ProtectedModule } from './modules/protected/protected.module'
import { ConfigModule } from '@nestjs/config'
import { appConfig } from '@avara/core/modules/user/config/app.config'
import { ContextMiddleware } from './middleware'

@Module({
  imports: [
    ProtectedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ContextMiddleware).forRoutes('*')
  }
}
