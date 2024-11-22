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
  parentCategoryId: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  metaFieldId: string

  @Field(() => String)
  @IsString()
  name: string

  @Field(() => String)
  @IsString()
  content: string

  @Field(() => String)
  @IsString()
  contentType: ContentType

  @Field(() => CategoryType)
  @IsString()
  categoryType: CategoryType
}

@ObjectType()
export class FindProductCategoryResponseType {
  @Field(() => [Category])
  items: Category[]

  @Field(() => PaginatedResponseMeta)
  pagination: PaginatedResponseMeta
}
