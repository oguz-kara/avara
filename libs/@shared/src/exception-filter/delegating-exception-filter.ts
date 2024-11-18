import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import { RestExceptionFilter } from './rest-exception-filter'
import { GqlExceptionFilter } from './gql-exception-filter'

@Catch()
export class DelegatingExceptionFilter implements ExceptionFilter {
  private restExceptionFilter = new RestExceptionFilter()
  private gqlExceptionFilter = new GqlExceptionFilter()

  catch(exception: unknown, host: ArgumentsHost) {
    const type = host.getType()

    if (type === 'http') {
      return this.restExceptionFilter.catch(exception, host)
    } else {
      return this.gqlExceptionFilter.catch(exception, host)
    }
  }
}
