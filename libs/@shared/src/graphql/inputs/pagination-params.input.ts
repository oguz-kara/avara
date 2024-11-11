import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsOptional } from 'class-validator'

@InputType()
export class PaginationParamsInput {
  @Field(() => Number)
  @IsOptional()
  @IsNumber()
  limit?: number

  @Field(() => Number)
  @IsOptional()
  @IsNumber()
  position?: number
}
