import { PaginatedResponseMeta } from '@avara/shared/graphql/pagination-response.graphql'
import { SimpleAuditingFields } from '@avara/shared/graphql/simple-auditing-fields.graphql'
import { Field, ObjectType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@ObjectType()
export class ProductCategory extends SimpleAuditingFields {
  @Field(() => String)
  @IsString()
  @IsOptional()
  id: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  parent_category_id: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  meta_field_id: string

  @Field(() => String)
  @IsString()
  name: string

  @Field(() => String)
  @IsString()
  mdx_content: string
}

@ObjectType()
export class FindProductCategoryResponseType {
  @Field(() => [ProductCategory])
  items: ProductCategory[]

  @Field(() => PaginatedResponseMeta)
  pagination: PaginatedResponseMeta
}
