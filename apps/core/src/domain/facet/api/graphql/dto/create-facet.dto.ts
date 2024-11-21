import { IDInput } from '@avara/core/domain/user/application/graphql/input/id.input'
import { Field, InputType, PartialType } from '@nestjs/graphql'
import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'

@InputType()
export class CreateFacetDto {
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

  @Field()
  @IsBoolean()
  @IsOptional()
  is_private?: boolean
}

@InputType()
export class EditFacetDto
  extends PartialType(CreateFacetDto)
  implements IDInput
{
  @Field()
  @IsString()
  id: string
}
