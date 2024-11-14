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
}

@InputType()
export class UpdateSeoMetadataDto extends PartialType(CreateSeoMetadataDto) {}
