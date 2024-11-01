import { Field, ID, ObjectType } from '@nestjs/graphql'
import { UserActiveStatus } from '@prisma/client'
import { PaginatedResponseMeta } from '../../../../../../@shared/src/graphql/pagination-response.graphql'
import { IsOptional } from 'class-validator'

@ObjectType()
export class UserType {
  @Field(() => ID)
  id: string

  @Field(() => ID)
  role_id: string

  @Field(() => String)
  email: string

  @Field(() => String)
  is_active: UserActiveStatus

  @Field(() => Boolean)
  email_verified: boolean

  @Field(() => Date)
  created_at: Date

  @Field(() => Date)
  updated_at: Date

  @Field(() => Date, { nullable: true })
  @IsOptional()
  deleted_at: Date

  @Field(() => String)
  created_by: string

  @Field(() => String, { nullable: true })
  updated_by: string

  @Field(() => String, { nullable: true })
  deleted_by: string

  static isTypeOf(value: any) {
    return value instanceof UserType
  }
}

@ObjectType()
export class CreateUserResponse {
  @Field(() => ID)
  id: string

  @Field(() => String)
  email: string

  @Field(() => String)
  is_active: UserActiveStatus

  @Field(() => String)
  email_verified: boolean
}

// Define the paginated response for roles
@ObjectType()
export class FindUsersResponseType {
  @Field(() => [UserType])
  items: UserType[]

  @Field(() => PaginatedResponseMeta)
  pagination: PaginatedResponseMeta
}
