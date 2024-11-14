import { registerEnumType } from '@nestjs/graphql'

export enum CategoryType {
  ARTICLE = 'ARTICLE',
  PRODUCT = 'PRODUCT',
  INDUSTRY = 'INDUSTRY',
}

registerEnumType(CategoryType, {
  name: 'CategoryType',
  description: 'The type of category e.g., product, industry, article',
})
