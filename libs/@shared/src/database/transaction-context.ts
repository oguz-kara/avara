import { Injectable } from '@nestjs/common'
import { DbService } from './db-service'
import { DbTransactionalClient } from './db-transactional-client'

@Injectable()
export class TransactionContext {
  constructor(private readonly dbService: DbService) {}

  async executeTransaction<T>(
    fn: (transactionClient: DbTransactionalClient) => Promise<T>,
  ): Promise<T> {
    return this.dbService.$transaction(
      async (transactionClient) => {
        return fn(transactionClient)
      },
      { timeout: 75000 },
    )
  }
}
