import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class PaginatedResponseMeta {
  @Field(() => Int)
  limit: number

  @Field(() => Int)
  total: number

  @Field(() => Int)
  position: number
}
