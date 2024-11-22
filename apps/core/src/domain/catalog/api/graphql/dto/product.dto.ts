import { Field, InputType } from '@nestjs/graphql'
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator'

@InputType()
export class CreateProductDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @IsUUID()
  featuredAssetId?: string

  @Field(() => [String], { nullable: true })
  @IsUUID(undefined, { each: true })
  @IsOptional()
  @IsArray()
  assetIds?: string[]

  @Field()
  @IsString()
  @MaxLength(255)
  @MinLength(1)
  name: string

  @Field()
  @IsString()
  @IsOptional()
  @MaxLength(5110)
  @MinLength(1)
  description?: string

  @Field()
  @IsBoolean()
  @IsOptional()
  draft?: boolean
}

@InputType()
export class EditProductDto {
  @Field()
  @IsString()
  @IsOptional()
  @IsUUID()
  featuredAssetId?: string

  @Field(() => [String], { nullable: true })
  @IsUUID(undefined, { each: true })
  @IsOptional()
  @IsArray()
  assetIds?: string[]

  @Field()
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @MinLength(1)
  name?: string

  @Field()
  @IsString()
  @IsOptional()
  @MaxLength(555)
  @MinLength(1)
  slug?: string

  @Field()
  @IsString()
  @IsOptional()
  @MaxLength(5110)
  @MinLength(1)
  description?: string

  @Field()
  @IsBoolean()
  @IsOptional()
  draft?: boolean

  @Field(() => [String], { nullable: true })
  @IsUUID(undefined, { each: true })
  @IsOptional()
  @IsArray()
  facetValueIds?: string[]
}
