import { InputType, Field } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'
import { CategoryType } from '../../../application/enums/category.enum'

@InputType()
export class CreateCategoryDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  parent_category_id: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  meta_field_id?: string

  @Field()
  @IsString()
  name: string

  @Field()
  @IsString()
  mdx_content: string

  @Field(() => CategoryType)
  @IsString()
  category_type: CategoryType
}

@InputType()
export class RenameProductCategoryInput {
  @Field()
  @IsString()
  name: string
}
