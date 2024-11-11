import { IDInput } from '@avara/core/modules/user/application/graphql/input/id.input'
import { Field, InputType, PartialType } from '@nestjs/graphql'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

@InputType()
export class CreateChannelDto {
  @Field()
  @IsString()
  name: string

  @Field()
  @IsString()
  code: string

  @Field()
  @IsString()
  @IsOptional()
  default_language_code?: string

  @Field()
  @IsString()
  @IsOptional()
  currency_code?: string

  @Field()
  @IsBoolean()
  is_default: boolean
}

@InputType()
export class EditChannelDto
  extends PartialType(CreateChannelDto)
  implements IDInput
{
  @Field()
  @IsString()
  id: string
}
