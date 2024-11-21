import { ChannelType } from '@avara/core/domain/channel/api/graphql/types/channel.graphql'
import { PaginatedResponseMeta } from '@avara/shared/graphql/types/pagination-response.graphql'
import { SimpleAuditingFields } from '@avara/shared/graphql/types/simple-auditing-fields.graphql'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'
import { FacetType } from './facet.graphql'

@ObjectType()
export class FacetValueType extends SimpleAuditingFields {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String)
  code: string

  @Field(() => [ChannelType])
  @IsOptional()
  channels?: ChannelType[]

  @Field(() => FacetType)
  @IsOptional()
  facet?: FacetType
}

@ObjectType()
export class FindFacetValuesResponseType {
  @Field(() => [FacetValueType])
  items: FacetValueType[]

  @Field(() => PaginatedResponseMeta)
  pagination: PaginatedResponseMeta
}
