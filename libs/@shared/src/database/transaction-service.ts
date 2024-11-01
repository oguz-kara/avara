import { Injectable } from '@nestjs/common'
import { DbService } from './db-service'
import { ITransaction } from './transaction.interface'

@Injectable()
export class TransactionService implements ITransaction {
  private currentTransaction: any = null

  constructor(private readonly prisma: DbService) {}

  async runInTransaction<T>(operation: () => Promise<T>): Promise<T> {
    if (this.currentTransaction) {
      return operation()
    }

    return await this.prisma.$transaction(async (prismaTransaction) => {
      this.currentTransaction = prismaTransaction

      try {
        const result = await operation()
        return result
      } finally {
        this.currentTransaction = null
      }
    })
  }

  createTransactionAwareRepository<T extends object>(repository: T): T {
    const prismaClient = this.currentTransaction || this.prisma

    const transactionAwareRepo = new Proxy(repository, {
      get: (target, prop, receiver) => {
        const origMethod = target[prop]

        if (typeof origMethod === 'function') {
          return async (...args: any[]) => {
            const metadata = args[args.length - 1]

            if (
              typeof metadata === 'object' &&
              metadata?.metadata?.transaction
            ) {
              return origMethod.apply(target, args)
            }

            return origMethod.apply(target, [
              ...args,
              { transaction: prismaClient },
            ])
          }
        }

        return Reflect.get(target, prop, receiver)
      },
    })

    return transactionAwareRepo
  }
}
