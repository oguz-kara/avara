import { ChannelType } from '@avara/core/domain/channel/api/graphql/types/channel.graphql'
import { PaginatedResponseMeta } from '@avara/shared/graphql/types/pagination-response.graphql'
import { SimpleAuditingFields } from '@avara/shared/graphql/types/simple-auditing-fields.graphql'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import { FacetValueType } from './facet-value.graphql'

@ObjectType()
export class FacetType extends SimpleAuditingFields {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String)
  code: string

  @Field(() => Boolean)
  is_private: boolean

  @Field(() => [ChannelType])
  @IsOptional()
  channels?: ChannelType[]

  @Field(() => [FacetValueType])
  @IsOptional()
  values?: FacetValueType[]
}

@ObjectType()
export class FindFacetsResponseType {
  @Field(() => [FacetType])
  items: FacetType[]

  @Field(() => PaginatedResponseMeta)
  pagination: PaginatedResponseMeta
}
