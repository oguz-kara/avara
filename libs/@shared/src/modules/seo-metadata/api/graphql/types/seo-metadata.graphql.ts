import { PaginatedResponseMeta } from '@avara/shared/graphql/types/pagination-response.graphql'
import { Field, ObjectType } from '@nestjs/graphql'
import { IsDate, IsNumber, IsString } from 'class-validator'

@ObjectType()
export class SeoMetadata {
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

  @Field()
  @IsString()
  cannonical_url?: string

  @Field()
  @IsString()
  og_title?: string

  @Field()
  @IsString()
  og_description?: string

  @Field()
  @IsString()
  og_image?: string

  @Field()
  @IsString()
  robots?: string

  @Field()
  @IsString()
  schema_markup?: string

  @Field()
  @IsString()
  hreflang?: string

  @Field()
  @IsString()
  page_type?: string

  @Field()
  @IsDate()
  created_at?: Date

  @Field()
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
