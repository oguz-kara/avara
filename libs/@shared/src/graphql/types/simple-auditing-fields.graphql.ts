import { Field, ObjectType } from '@nestjs/graphql'
import { IsDate, IsOptional, IsString } from 'class-validator'

@ObjectType()
export class SimpleAuditingFields {
  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  created_at: Date

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  created_by: string

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  updated_at: Date

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  updated_by: string

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  deleted_at: Date

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  deleted_by: string
}
