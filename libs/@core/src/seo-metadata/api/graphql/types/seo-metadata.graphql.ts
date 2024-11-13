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
  canonical_url?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  og_title?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  og_description?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  og_image?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  robots?: string

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  schema_markup?: JsonValue

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  hreflang?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  page_type?: string

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  created_at?: Date

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  updated_at?: Date
}

@ObjectType()
export class FindSeoMetadataListResponseType {
  @Field(() => [SeoMetadata])
  items: SeoMetadata[]

  @Field(() => PaginatedResponseMeta)
  pagination: PaginatedResponseMeta
}
