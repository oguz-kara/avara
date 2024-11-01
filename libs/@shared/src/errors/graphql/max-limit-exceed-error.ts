import { ObjectType } from '@nestjs/graphql'
import { ErrorResult } from '../error-result'

@ObjectType()
export class MaxLimitExceedError extends ErrorResult {
  errorCode = 'MAX_LIMIT_EXCEED_ERROR'

  message = 'You have exceeded the maximum limit of retrieving data'

  isTypeOf(value: any) {
    return value instanceof MaxLimitExceedError
  }
}
