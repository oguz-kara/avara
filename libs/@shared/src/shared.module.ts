import { Global, Module } from '@nestjs/common'
import { DbService } from './database/db-service'
import { APP_GUARD } from '@nestjs/core'
import { PermissionsGuard } from './guards/permission.guard'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { UserModule } from '@avara/core/modules/user/user.module'
import { PaginationUtils } from './utils/pagination.util'
import { CategoryModule } from './modules/category/category.module'

@Global()
@Module({
  imports: [
    UserModule,
    CategoryModule,
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
  ],
  exports: [PaginationUtils, DbService, CategoryModule],
})
export class SharedModule {}
