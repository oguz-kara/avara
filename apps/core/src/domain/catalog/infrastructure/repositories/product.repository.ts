import { Injectable } from '@nestjs/common'
import { Product } from '@prisma/client'
import { DbTransactionalClient } from '@avara/shared/database/db-transactional-client'
import { DbService } from '@avara/shared/database/db-service'
import { CoreRepository } from '@avara/core/domain/user/infrastructure/orm/repository/core-repository'

@Injectable()
export class ProductRepository extends CoreRepository<Product> {
  transaction: DbTransactionalClient | null = null

  constructor(private readonly db: DbService) {
    super(db, 'Product')
  }
}
