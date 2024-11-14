import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { IDInput } from '@avara/core/domain/user/application/graphql/input/id.input'
import { PaginationParamsInput } from '@avara/shared/graphql/inputs/pagination-params.input'
import { Allow } from '@avara/shared/decorators/allow'
import { Permission } from '@avara/shared/enums/permission'
import { ChannelType, FindChannelsResponseType } from '../types/channel.graphql'
import { ChannelService } from '../../../application/services/channel.service'
import { CreateChannelDto, EditChannelDto } from '../dto/create-channel.dto'
import { FindChannelByCodeInput } from '../input/find-channel-by-code.input'

@Resolver(() => ChannelType)
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Allow(Permission.CREATE_CHANNEL_GLOBAL, Permission.WRITE_CHANNEL_GLOBAL)
  @Mutation(() => ChannelType)
  async createChannel(@Args('input') createUserInput: CreateChannelDto) {
    const channel = await this.channelService.createChannel(createUserInput)

    return channel
  }

  @Allow(Permission.DELETE_CHANNEL_GLOBAL, Permission.WRITE_CHANNEL_GLOBAL)
  @Mutation(() => ChannelType)
  async markChannelAsDeleted(@Args('input') removeChannelInput: IDInput) {
    const channel = await this.channelService.markChannelAsDeleted(
      removeChannelInput.id,
    )

    return channel
  }

  @Allow(Permission.READ_CHANNEL_GLOBAL)
  @Query(() => FindChannelsResponseType)
  async channels(
    @Args('input', { nullable: true }) pagination?: PaginationParamsInput,
  ) {
    const channelsData =
      await this.channelService.getChannelsWithPagination(pagination)

    return channelsData
  }

  @Allow(Permission.READ_CHANNEL_GLOBAL)
  @Query(() => ChannelType, { nullable: true })
  async findChannelById(@Args('input') findChannelInput: IDInput) {
    const { id } = findChannelInput
    const channel = await this.channelService.getChannelById(id)

    return channel
  }

  @Allow(Permission.READ_CHANNEL_GLOBAL)
  @Query(() => ChannelType, { nullable: true })
  async findChannelByCode(
    @Args('input') findChannelInput: FindChannelByCodeInput,
  ) {
    const { code } = findChannelInput
    const channel = await this.channelService.getChannelByCode(code)

    return channel
  }

  @Allow(Permission.UPDATE_CHANNEL_GLOBAL, Permission.WRITE_CHANNEL_GLOBAL)
  @Mutation(() => ChannelType, { nullable: true })
  async editChannel(@Args('input') editChannelInput: EditChannelDto) {
    const { id, ...rest } = editChannelInput

    const channel = await this.channelService.editChannel(id, rest)

    return channel
  }
}
