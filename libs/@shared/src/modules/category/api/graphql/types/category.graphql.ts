import { PaginatedResponseMeta } from '@avara/shared/graphql/types/pagination-response.graphql'
import { SimpleAuditingFields } from '@avara/shared/graphql/types/simple-auditing-fields.graphql'
import { Field, ObjectType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'
import { CategoryType } from '../../../application/enums/category.enum'
import { ContentType } from '@prisma/client'

@ObjectType()
export class Category extends SimpleAuditingFields {
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
  content: string

  @Field(() => String)
  @IsString()
  content_type: ContentType

  @Field(() => CategoryType)
  @IsString()
  category_type: CategoryType
}

@ObjectType()
export class FindProductCategoryResponseType {
  @Field(() => [Category])
  items: Category[]

  @Field(() => PaginatedResponseMeta)
  pagination: PaginatedResponseMeta
}
