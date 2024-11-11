import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ChannelRepository } from '../../infrastructure/repositories/channel.repository'
import { CreateChannelDto } from '../../api/graphql/dto/create-channel.dto'
import { PaginationUtils } from '@avara/shared/utils/pagination.util'
import { ConfigService } from '@nestjs/config'
import { Channel } from '../../domain/entities/channel.entity'
import { PaginationParams } from '@avara/core/modules/user/api/types/pagination.type'
import { PaginatedItemsResponse } from '@avara/core/modules/user/api/types/items-response.type'
import { ID } from '@avara/shared/types/id.type'

@Injectable()
export class ChannelService {
  constructor(
    private readonly repo: ChannelRepository,
    private readonly paginationUtils: PaginationUtils,
    private readonly configService: ConfigService,
  ) {}

  async createChannel(input: CreateChannelDto) {
    const existedChannel = await this.repo.findByCode(input.code)
    const defaultCurrency = this.configService.get<string>(
      'localization.currency.default',
    )
    const defaultLanguage = this.configService.get<string>(
      'localization.language.default',
    )

    if (existedChannel) throw new ConflictException('Channel already exists!')

    const channel = new Channel({
      id: undefined,
      name: input.name,
      code: input.code,
      currency_code: input.currency_code || defaultCurrency,
      default_language_code: input.default_language_code || defaultLanguage,
      is_default: input.is_default,
      created_by: 'system',
      updated_by: 'system',
    })

    await this.repo.save(channel)

    return channel
  }

  async editChannel(id: ID, input: Partial<CreateChannelDto>) {
    const channel = await this.repo.findById(id)

    if (!channel) throw new NotFoundException('Channel not found to update!')

    if (input.code && input.code !== channel.code) {
      const existingChannel = await this.repo.findByCode(input.code)
      if (existingChannel)
        throw new ConflictException('A channel with this code already exists!')
    }

    channel.updateDetails(input)

    await this.repo.save(channel)

    return channel
  }

  async getChannelById(id: string): Promise<Channel | null> {
    const channel = await this.repo.findById(id)

    if (!channel) return null

    return channel
  }

  async getOrCreateDefaultChannel(): Promise<Channel | null> {
    let channel = await this.repo.findDefaultChannel()
    const defaultLanguage = this.configService.get<string>(
      'localization.language.default',
      'EN',
    )
    const defaultCurrencyCode = this.configService.get<string>(
      'localization.currency.default',
      'USD',
    )

    if (!channel)
      channel = await this.createChannel({
        code: 'default',
        name: 'Default Channel',
        is_default: true,
        default_language_code: defaultLanguage,
        currency_code: defaultCurrencyCode,
      })

    return channel
  }

  async getChannelByCode(name: string): Promise<Channel | null> {
    const channel = await this.repo.findByCode(name)

    return channel
  }

  async getChannelsWithPagination(
    params?: PaginationParams,
  ): Promise<PaginatedItemsResponse<Channel>> {
    const { limit, position } =
      this.paginationUtils.validateAndGetPaginationLimit(params)

    const channelsData = await this.repo.findAll({
      limit,
      position,
    })

    return channelsData
  }

  async removeChannelById(id: string) {
    const channel = await this.repo.findById(id)

    if (!channel) throw new NotFoundException('Channel not found to remove!')

    const removedChannel = await this.repo.remove(id)

    return removedChannel
  }

  async markChannelAsDeleted(id: string) {
    const channel = await this.repo.findById(id)

    if (!channel) throw new NotFoundException('Channel not found to remove!')

    channel.softDelete('system')

    await this.repo.save(channel)

    return channel
  }
}
