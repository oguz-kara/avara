import { Injectable } from '@nestjs/common'
import { DbService } from './db-service'
import { ITransaction } from './transaction.interface'
import { DbTransactionalClient } from './db-transactional-client'
import { TransactionAware } from './transaction-aware.abstract'

@Injectable()
export class DBTransactionService implements ITransaction {
  private currentTransaction: DbTransactionalClient = null

  constructor(private readonly repository: DbService) {}

  async runInTransaction<T>(operation: () => Promise<T>): Promise<T> {
    if (this.currentTransaction) {
      return operation()
    }

    return await this.repository.$transaction(async (dbTransaction) => {
      this.currentTransaction = dbTransaction

      try {
        const result = await operation()
        return result
      } finally {
        this.currentTransaction = null
      }
    })
  }

  createTransactionAwareRepository<T extends TransactionAware>(
    repository: T,
  ): T {
    const dbClient = this.currentTransaction || this.repository
    repository.setTransactionObject(dbClient)

    return repository
  }
}
