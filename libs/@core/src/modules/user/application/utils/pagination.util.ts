import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PaginationParams } from '../../api/types/pagination.type'

@Injectable()
export class PaginationUtils {
  constructor(private readonly configService: ConfigService) {}

  validateAndGetPaginationLimit(args: PaginationParams): PaginationParams {
    const { limit, position } = this.getPaginationParamsFromConfig(args)

    if (this.isExceedingMaxLimit(limit)) {
      const error = new Error('Max limit exceeded')
      error.name = 'INPUT_VALIDATION_ERROR'

      throw error
    }

    return { limit, position }
  }

  private getPaginationParamsFromConfig(
    args: PaginationParams,
  ): PaginationParams {
    return {
      limit: args?.limit
        ? args.limit
        : this.configService.get<number>('paginationOptions.defaultLimit'),
      position: args?.position
        ? args.limit
        : this.configService.get<number>('paginationOptions.defaultPosition'),
    }
  }

  private isExceedingMaxLimit(limit: number) {
    const maxLimit = this.configService.get<number>(
      'paginationOptions.maxLimit',
    )

    return limit > maxLimit
  }
}
