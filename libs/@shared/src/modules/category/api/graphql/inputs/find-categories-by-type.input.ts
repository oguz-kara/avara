import { PaginationParamsInput } from '@avara/shared/graphql/inputs/pagination-params.input'
import { Field, InputType } from '@nestjs/graphql'
import { CategoryType } from '../../../application/enums/category.enum'

@InputType()
export class FindCategoriesByTypeInput extends PaginationParamsInput {
  @Field(() => CategoryType)
  type: CategoryType
}
