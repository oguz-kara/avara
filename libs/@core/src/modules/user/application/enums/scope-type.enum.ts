import { registerEnumType } from '@nestjs/graphql'

export enum ScopeType {
  GLOBAL = 'GLOBAL',
  LOCAL = 'LOCAL',
}

registerEnumType(ScopeType, {
  name: 'ScopeType',
  description: 'The type of scope',
})
