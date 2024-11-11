import { PaginationParamsInput } from '@avara/shared/graphql/inputs/pagination-params.input'
import { Field, InputType } from '@nestjs/graphql'
import { CategoryType } from '../../../application/enums/category.enum'
import { IsOptional } from 'class-validator'

@InputType()
export class FindCategoriesByTypeInput extends PaginationParamsInput {
  @Field(() => CategoryType, { nullable: true })
  @IsOptional()
  type: CategoryType
}
