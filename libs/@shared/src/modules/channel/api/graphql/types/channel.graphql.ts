import { PaginatedResponseMeta } from '@avara/shared/graphql/types/pagination-response.graphql'
import { SimpleAuditingFields } from '@avara/shared/graphql/types/simple-auditing-fields.graphql'
import { ID } from '@avara/shared/types/id.type'
import { Field, ObjectType } from '@nestjs/graphql'
import { IsBoolean, IsString } from 'class-validator'

@ObjectType()
export class ChannelType extends SimpleAuditingFields {
  @Field(() => String)
  @IsString()
  id: ID

  @Field()
  @IsString()
  name: string

  @Field()
  @IsString()
  code: string

  @Field()
  @IsString()
  default_language_code: string

  @Field()
  @IsString()
  currency_code: string

  @Field()
  @IsBoolean()
  is_default: boolean
}

@ObjectType()
export class FindChannelsResponseType {
  @Field(() => [ChannelType])
  items: ChannelType[]

  @Field(() => PaginatedResponseMeta)
  pagination: PaginatedResponseMeta
}
