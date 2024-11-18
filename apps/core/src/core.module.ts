import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { appConfig } from './config/app.config'
import { ProtectedModule } from './protected/protected.module'
import { SharedModule } from '@avara/shared/shared.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'assets'),
      serveRoot: '/assets',
    }),
    ProtectedModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule {}
