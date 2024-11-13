import { Field, ObjectType } from '@nestjs/graphql'
import { ChannelType } from './channel.graphql'
import { IsOptional } from 'class-validator'

ObjectType()
export class ChannelListAware {
  @Field(() => [ObjectType])
  @IsOptional()
  channels?: ChannelType[]
}

ObjectType()
export class ChannelAware {
  @Field(() => ChannelType)
  @IsOptional()
  channel?: ChannelType
}
