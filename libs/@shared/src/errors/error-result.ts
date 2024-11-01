import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export abstract class ErrorResult {
  @Field()
  abstract errorCode: string

  @Field()
  abstract message: string
}
