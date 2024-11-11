import { Field, ID, ObjectType } from '@nestjs/graphql'
import { PaginatedResponseMeta } from '../../../../../../@shared/src/graphql/types/pagination-response.graphql'
import { IsOptional } from 'class-validator'
import { ChannelType } from '@avara/shared/modules/channel/api/graphql/types/channel.graphql'

@ObjectType()
export class Role {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string

  @Field(() => [ChannelType])
  @IsOptional()
  channels?: ChannelType[]
}

@ObjectType()
export class CreateRoleResponse {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string
}

@ObjectType()
export class FindRolesResponseType {
  @Field(() => [Role])
  items: Role[]

  @Field(() => PaginatedResponseMeta)
  pagination: PaginatedResponseMeta
}
