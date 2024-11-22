import { Field, ObjectType } from '@nestjs/graphql'
import { IsDate, IsOptional, IsString } from 'class-validator'

@ObjectType()
export class SimpleAuditingFields {
  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  createdAt: Date

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  createdBy: string

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  updatedAt: Date

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  updatedBy: string

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  deletedAt: Date

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  deletedBy: string
}
