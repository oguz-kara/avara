import {
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
// import { GqlArgumentsHost } from '@nestjs/graphql'
import { GraphQLError } from 'graphql'
import { DomainValidationError } from '../errors/domain-validation.error'

@Catch()
export class GqlExceptionFilter implements ExceptionFilter {
  catch(exception: unknown) {
    if (exception instanceof DomainValidationError) {
      return new GraphQLError(exception.message, {
        extensions: {
          code: 'BAD_USER_INPUT',
          validationErrors: exception.errors,
        },
      })
    }

    // Handle HttpException
    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const response = exception.getResponse()

      return new GraphQLError(exception.message, {
        extensions: {
          code:
            status === HttpStatus.BAD_REQUEST
              ? 'BAD_USER_INPUT'
              : 'INTERNAL_SERVER_ERROR',
          response,
        },
      })
    }

    // Log unexpected errors for debugging
    console.error('Unexpected exception:', exception)

    // Handle all other unexpected exceptions
    return new GraphQLError('An unexpected error occurred.', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
      },
    })
  }
}
