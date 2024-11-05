import { Field, InputType } from '@nestjs/graphql'
import { CategoryType } from '../../../application/enums/category.enum'
import { NameInput } from '@avara/core/modules/user/application/graphql/input/name.input'

@InputType()
export class FindByNameAndTypeInput extends NameInput {
  @Field(() => CategoryType)
  type: CategoryType
}
