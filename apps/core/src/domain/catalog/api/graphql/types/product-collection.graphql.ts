import { Field, ObjectType, ID } from '@nestjs/graphql'
import { ProductType } from './product.graphql'

@ObjectType()
export class ProductCollection {
  @Field(() => ID)
  id: string

  @Field()
  name: string

  @Field({ nullable: true })
  slug?: string

  @Field({ nullable: true })
  description?: string

  @Field()
  isDynamic: boolean

  @Field(() => [ProductType])
  products: ProductType[]

  @Field({ nullable: true })
  rules?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field({ nullable: true })
  createdBy?: string

  @Field({ nullable: true })
  updatedBy?: string

  @Field({ nullable: true })
  deletedAt?: Date

  @Field({ nullable: true })
  deletedBy?: string
}
