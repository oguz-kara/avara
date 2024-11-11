import { Global, Module } from '@nestjs/common'
import { DbService } from './database/db-service'
import { APP_GUARD } from '@nestjs/core'
import { PermissionsGuard } from './guards/permission.guard'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserModule } from '@avara/core/modules/user/user.module'
import { PaginationUtils } from './utils/pagination.util'
import { CategoryModule } from './modules/category/category.module'
import { ChannelModule } from './modules/channel/channel.module'
import { SeoMetadataModule } from './modules/seo-metadata/seo-metadata.module'
import { SharedRepositories } from './shared.repositories'

@Global()
@Module({
  imports: [
    UserModule,
    CategoryModule,
    ChannelModule,
    SeoMetadataModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    DbService,
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    PaginationUtils,
    SharedRepositories,
  ],
  exports: [
    PaginationUtils,
    DbService,
    CategoryModule,
    ChannelModule,
    SeoMetadataModule,
    SharedRepositories,
  ],
})
export class SharedModule {}
