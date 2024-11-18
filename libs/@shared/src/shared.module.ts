import { Global, Module } from '@nestjs/common'
import { DbService } from './database/db-service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PaginationUtils } from './utils/pagination.util'
import { TransactionContext } from './database/transaction-context'

@Global()
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
  ],
  providers: [DbService, PaginationUtils, TransactionContext],
  exports: [PaginationUtils, DbService, TransactionContext],
})
export class SharedModule {}
