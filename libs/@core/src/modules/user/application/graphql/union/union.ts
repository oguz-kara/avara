import { createUnionType } from '@nestjs/graphql'
import { Permission } from '../../../domain/entities/permission.entity'
import { MaxLimitExceedError } from '@avara/shared/errors/graphql/max-limit-exceed-error'

export const FindPermissionsResult = createUnionType({
  name: 'FindPermissionResult',
  types: () => [Permission, MaxLimitExceedError] as const,
  resolveType(value) {
    if (value instanceof Permission) {
      return Permission
    }
    if (value instanceof MaxLimitExceedError) {
      return MaxLimitExceedError
    }
    return null
  },
})
