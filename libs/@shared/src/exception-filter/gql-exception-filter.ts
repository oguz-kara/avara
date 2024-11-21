import { Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'
// import { GqlArgumentsHost } from '@nestjs/graphql'
import { GraphQLError } from 'graphql'
import { Prisma } from '@prisma/client'

@Catch()
export class GqlExceptionFilter implements ExceptionFilter {
  catch(exception: unknown) {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2000': {
          throw new GraphQLError(
            'The value you entered is too long. Please shorten it and try again.',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                status: HttpStatus.BAD_REQUEST,
              },
            },
          )
        }
        case 'P2001': {
          throw new GraphQLError(
            'No record matches the provided details. Please verify your input and try again.',
            {
              extensions: { code: 'NOT_FOUND', status: HttpStatus.NOT_FOUND },
            },
          )
        }
        case 'P2002': {
          const fields = exception.meta?.target as string[]
          throw new GraphQLError(
            `The value for field(s) ${fields?.join(', ')} already exists. Please use a different value.`,
            {
              extensions: {
                code: 'UNIQUE_FIELD',
                status: HttpStatus.BAD_REQUEST,
                fields,
              },
            },
          )
        }
        case 'P2003': {
          throw new GraphQLError(
            'The operation failed because it relies on a related record that does not exist.',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                status: HttpStatus.BAD_REQUEST,
              },
            },
          )
        }
        case 'P2004': {
          throw new GraphQLError(
            'The operation failed due to a constraint violation. Please review your data and try again.',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                status: HttpStatus.BAD_REQUEST,
              },
            },
          )
        }
        case 'P2005': {
          throw new GraphQLError(
            'The value provided for one of the fields is invalid. Please correct it and try again.',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                status: HttpStatus.BAD_REQUEST,
              },
            },
          )
        }
        case 'P2006': {
          throw new GraphQLError(
            'The format of the value provided is incorrect. Please correct it and try again.',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                status: HttpStatus.BAD_REQUEST,
              },
            },
          )
        }
        case 'P2007': {
          throw new GraphQLError(
            'The data you provided is invalid. Please review it and try again.',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                status: HttpStatus.BAD_REQUEST,
              },
            },
          )
        }
        case 'P2008': {
          throw new GraphQLError(
            'There was an error processing your request. Please contact support if the issue persists.',
            {
              extensions: {
                code: 'INTERNAL_SERVER_ERROR',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
              },
            },
          )
        }
        case 'P2009': {
          throw new GraphQLError(
            'There was an error validating your request. Please contact support if the issue persists.',
            {
              extensions: {
                code: 'INTERNAL_SERVER_ERROR',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
              },
            },
          )
        }
        case 'P2010': {
          throw new GraphQLError(
            'An error occurred while executing your query. Please contact support if the issue persists.',
            {
              extensions: {
                code: 'INTERNAL_SERVER_ERROR',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
              },
            },
          )
        }
        case 'P2011': {
          throw new GraphQLError(
            'A required field is missing. Please ensure all required fields are provided.',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                status: HttpStatus.BAD_REQUEST,
              },
            },
          )
        }
        case 'P2012': {
          throw new GraphQLError(
            'A required field is missing from your input. Please review your data and try again.',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                status: HttpStatus.BAD_REQUEST,
              },
            },
          )
        }
        case 'P2013': {
          throw new GraphQLError(
            'A required argument is missing. Please provide it and try again.',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                status: HttpStatus.BAD_REQUEST,
              },
            },
          )
        }
        case 'P2014': {
          throw new GraphQLError(
            'The operation failed because it would violate a relation constraint.',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                status: HttpStatus.BAD_REQUEST,
              },
            },
          )
        }
        case 'P2015': {
          throw new GraphQLError(
            'A required related record could not be found. Please verify your data and try again.',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                status: HttpStatus.BAD_REQUEST,
              },
            },
          )
        }
        case 'P2016': {
          throw new GraphQLError(
            'An error occurred while processing your request. Please contact support if the issue persists.',
            {
              extensions: {
                code: 'INTERNAL_SERVER_ERROR',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
              },
            },
          )
        }
        case 'P2017': {
          throw new GraphQLError(
            'A required table does not exist in the database. Please contact support if the issue persists.',
            {
              extensions: {
                code: 'INTERNAL_SERVER_ERROR',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
              },
            },
          )
        }
        case 'P2018': {
          throw new GraphQLError(
            'A required column does not exist in the database. Please contact support if the issue persists.',
            {
              extensions: {
                code: 'INTERNAL_SERVER_ERROR',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
              },
            },
          )
        }
        case 'P2019': {
          throw new GraphQLError(
            'The data provided for a field is invalid. Please correct it and try again.',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                status: HttpStatus.BAD_REQUEST,
              },
            },
          )
        }
        case 'P2020': {
          throw new GraphQLError(
            'A value is out of range. Please ensure your data is within the acceptable range and try again.',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                status: HttpStatus.BAD_REQUEST,
              },
            },
          )
        }
        case 'P2021': {
          throw new GraphQLError(
            'A required table is missing from the database. Please contact support if the issue persists.',
            {
              extensions: {
                code: 'INTERNAL_SERVER_ERROR',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
              },
            },
          )
        }
        case 'P2022': {
          throw new GraphQLError(
            'A required column is missing from the database. Please contact support if the issue persists.',
            {
              extensions: {
                code: 'INTERNAL_SERVER_ERROR',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
              },
            },
          )
        }
        case 'P2023': {
          throw new GraphQLError(
            'The data in the database is inconsistent. Please contact support to resolve this issue.',
            {
              extensions: {
                code: 'INTERNAL_SERVER_ERROR',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
              },
            },
          )
        }
        case 'P2024': {
          throw new GraphQLError('The operation timed out. Please try again.', {
            extensions: {
              code: 'REQUEST_TIMEOUT',
              status: HttpStatus.REQUEST_TIMEOUT,
            },
          })
        }
        case 'P2025': {
          throw new GraphQLError(
            'The record you are trying to update or delete does not exist. Please verify your input.',
            {
              extensions: { code: 'NOT_FOUND', status: HttpStatus.NOT_FOUND },
            },
          )
        }
        case 'P2026': {
          throw new GraphQLError(
            'Unable to connect to the database. Please ensure the database is running and try again.',
            {
              extensions: {
                code: 'INTERNAL_SERVER_ERROR',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
              },
            },
          )
        }
        case 'P2027': {
          throw new GraphQLError(
            'The request attempted to fetch more records than allowed. Please narrow your query and try again.',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                status: HttpStatus.BAD_REQUEST,
              },
            },
          )
        }
        case 'P2030': {
          throw new GraphQLError(
            'The provided parameters do not match the expected format. Please review and try again.',
            {
              extensions: {
                code: 'BAD_USER_INPUT',
                status: HttpStatus.BAD_REQUEST,
              },
            },
          )
        }
        default: {
          throw new GraphQLError(
            'An unexpected database error occurred. Please try again later.',
            {
              extensions: {
                code: 'INTERNAL_SERVER_ERROR',
                status: HttpStatus.INTERNAL_SERVER_ERROR,
              },
            },
          )
        }
      }
    }

    const userFriendlyMessage =
      (exception as any)?.message || 'Something went wrong. Please try again.'
    throw new GraphQLError(userFriendlyMessage, {
      extensions: {
        code: (exception as any)?.code || 'INTERNAL_SERVER_ERROR',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      },
    })
  }
}
