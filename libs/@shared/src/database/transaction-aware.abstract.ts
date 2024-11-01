import { PrismaClient } from '@prisma/client'
import { DbTransactionalClient } from './db-transactional-client'

export abstract class TransactionAware {
  protected transaction: DbTransactionalClient | null = null

  setTransactionObject(transaction: DbTransactionalClient) {
    this.transaction = transaction
  }

  abstract getClient(): DbTransactionalClient | PrismaClient
}
