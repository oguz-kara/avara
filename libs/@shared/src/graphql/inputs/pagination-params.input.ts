import { Field, InputType } from '@nestjs/graphql'
import { IsNumber, IsOptional } from 'class-validator'

@InputType()
export class PaginationParamsInput {
  @Field()
  @IsOptional()
  @IsNumber({}, { message: 'Limit must be a number' })
  limit?: number

  @Field()
  @IsOptional()
  @IsNumber()
  position?: number
}
