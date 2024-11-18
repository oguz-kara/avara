import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Response } from 'express'
import { DomainValidationError } from '../errors/domain-validation.error'
import { FileError } from '@avara/core/domain/asset/domain/errors/file-error'

@Catch()
export class RestExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    if (exception instanceof DomainValidationError) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        message: exception.message,
        errors: exception.errors || null,
      })
    }

    if (exception instanceof FileError) {
      return response.status(exception.status).json({
        message: exception.message,
        errorCode: exception.name,
      })
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const errorResponse = exception.getResponse()

      return response.status(status).json({
        errorResponse,
        message: exception.message,
      })
    }

    console.error('Unexpected exception:', exception)

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'An unexpected error occurred.',
      code: 'INTERNAL_SERVER_ERROR',
    })
  }
}
