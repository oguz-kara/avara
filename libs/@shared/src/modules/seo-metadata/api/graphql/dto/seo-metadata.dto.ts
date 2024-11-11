import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator'

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
  cannonical_url?: string

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
  @IsObject()
  @IsOptional()
  schema_markup?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  hreflang?: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  page_type?: string
}
