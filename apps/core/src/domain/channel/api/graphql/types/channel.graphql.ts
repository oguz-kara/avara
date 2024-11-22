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
  defaultLanguageCode: string

  @Field()
  @IsString()
  currencyCode: string

  @Field()
  @IsBoolean()
  isDefault: boolean
}

@ObjectType()
export class FindChannelsResponseType {
  @Field(() => [ChannelType])
  items: ChannelType[]

  @Field(() => PaginatedResponseMeta)
  pagination: PaginatedResponseMeta
}
