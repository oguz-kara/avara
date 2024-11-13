import { Module } from '@nestjs/common'
import { SharedModule } from '@avara/shared/shared.module'
import { CategoryProviders } from './category'
import { ChannelProviders } from './channel'
import { SeoMetadataProviders } from './seo-metadata'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserProviders } from './user'
import { APP_GUARD } from '@nestjs/core'
import { PermissionsGuard } from './application/guards/permission.guard'
import { CoreRepositories } from './application/core-repositories'

@Module({
  imports: [
    SharedModule,
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
    ...CategoryProviders,
    ...ChannelProviders,
    ...SeoMetadataProviders,
    ...UserProviders,
    CoreRepositories,
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
  ],
  exports: [
    ...CategoryProviders,
    ...ChannelProviders,
    ...SeoMetadataProviders,
    ...UserProviders,
  ],
})
export class CoreModule {}
