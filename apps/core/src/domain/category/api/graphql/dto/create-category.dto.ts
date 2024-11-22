import { InputType, Field } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'
import { CategoryType } from '../../../application/enums/category.enum'

@InputType()
export class CreateCategoryDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  parentCategoryId: string

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  metaFieldId?: string

  @Field()
  @IsString()
  name: string

  @Field()
  @IsString()
  content: string

  @Field()
  @IsString()
  contentType: string

  @Field(() => CategoryType)
  @IsString()
  categoryType: CategoryType
}

@InputType()
export class RenameProductCategoryInput {
  @Field()
  @IsString()
  name: string
}
