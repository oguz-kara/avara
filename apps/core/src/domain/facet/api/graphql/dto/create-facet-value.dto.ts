import { IDInput } from '@avara/core/domain/user/application/graphql/input/id.input'
import { Field, InputType, PartialType } from '@nestjs/graphql'
import { IsString, MaxLength, MinLength } from 'class-validator'

@InputType()
export class CreateFacetValueDto {
  @Field()
  @IsString()
  facetId: string

  @Field()
  @IsString()
  @MaxLength(60, { message: 'Name is too long' })
  @MinLength(2)
  name: string

  @Field()
  @IsString()
  @MaxLength(60)
  @MinLength(2)
  code: string
}

@InputType()
export class CreateFacetValueListDto {
  @Field(() => [CreateFacetValueDto])
  values: CreateFacetValueDto[]
}

@InputType()
export class EditFacetValueDto
  extends PartialType(CreateFacetValueDto)
  implements IDInput
{
  @Field()
  @IsString()
  id: string
}
