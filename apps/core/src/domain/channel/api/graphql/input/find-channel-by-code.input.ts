import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class FindChannelByCodeInput {
  @Field()
  @IsString()
  code: string
}
