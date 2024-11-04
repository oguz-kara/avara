import { InputType, Field, ObjectType } from '@nestjs/graphql'
import { IsBoolean, IsOptional, IsString } from 'class-validator'

@InputType()
export class CreateProductCategoryDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  parent_category_id: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  meta_field_id: string

  @Field()
  @IsString()
  name: string

  @Field()
  @IsString()
  mdx_content: string
}

@ObjectType()
export class CreateProductCategoryResponse {
  @Field()
  @IsString()
  email: string

  @Field()
  @IsString()
  role_id: string

  @Field()
  @IsBoolean()
  email_verified: boolean
}

@InputType()
export class RenameProductCategoryInput {
  @Field()
  @IsString()
  name: string
}
