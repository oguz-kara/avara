import { PaginatedResponseMeta } from '@avara/shared/graphql/types/pagination-response.graphql'
import { Field, ObjectType } from '@nestjs/graphql'
import { JsonValue } from '@prisma/client/runtime/library'
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator'

@ObjectType()
export class SeoMetadata {
  @Field()
  @IsOptional()
  @IsString()
  id: string

  @Field()
  @IsString()
  title: string

  @Field()
  @IsString()
  description: string

  @Field()
  @IsString()
  keywords: string

  @Field()
  @IsNumber()
  version: number

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  canonicalUrl?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  ogTitle?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  ogDescription?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  ogImage?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  robots?: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  schemaMarkup?: JsonValue

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  hreflang?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  pageType?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  createdAt?: Date

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  updatedAt?: Date
}

@ObjectType()
export class FindSeoMetadataListResponseType {
  @Field(() => [SeoMetadata])
  items: SeoMetadata[]

  @Field(() => PaginatedResponseMeta)
  pagination: PaginatedResponseMeta
}
