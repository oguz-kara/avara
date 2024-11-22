import { Field, InputType, PartialType } from '@nestjs/graphql'
import { JsonValue } from '@prisma/client/runtime/library'
import { IsNumber, IsOptional, IsString } from 'class-validator'

@InputType()
export class CreateSeoMetadataDto {
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
}

@InputType()
export class UpdateSeoMetadataDto extends PartialType(CreateSeoMetadataDto) {}
