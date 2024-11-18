import { PrismaClient } from '@prisma/client'
import { DbTransactionalClient } from './db-transactional-client'

export interface TransactionAware {
  transaction: DbTransactionalClient | null

  setTransactionObject(transaction: DbTransactionalClient): void

  getClient(
    transaction?: DbTransactionalClient,
  ): DbTransactionalClient | PrismaClient
}
