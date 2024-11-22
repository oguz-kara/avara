import { IDInput } from '@avara/core/domain/user/application/graphql/input/id.input'
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
  defaultLanguageCode?: string

  @Field()
  @IsString()
  @IsOptional()
  currencyCode?: string

  @Field()
  @IsBoolean()
  isDefault: boolean
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
