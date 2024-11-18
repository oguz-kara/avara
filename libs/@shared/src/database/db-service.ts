import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { DbTransactionalClient } from './db-transactional-client'

@Injectable()
export class DbService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }

  async executeTransaction<T>(
    fn: (transactionClient: DbTransactionalClient) => Promise<T>,
  ): Promise<T> {
    return this.$transaction(async (transactionClient) => {
      return fn(transactionClient)
    })
  }
}
