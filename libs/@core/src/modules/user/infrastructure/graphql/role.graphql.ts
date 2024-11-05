import { Field, ID, ObjectType } from '@nestjs/graphql'
import { PaginatedResponseMeta } from '../../../../../../@shared/src/graphql/types/pagination-response.graphql'

@ObjectType()
export class Role {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string
}

@ObjectType()
export class CreateRoleResponse {
  @Field(() => ID)
  id: string

  @Field(() => String)
  name: string
}

// Define the paginated response for roles
@ObjectType()
export class FindRolesResponseType {
  @Field(() => [Role])
  items: Role[]

  @Field(() => PaginatedResponseMeta)
  pagination: PaginatedResponseMeta
}
