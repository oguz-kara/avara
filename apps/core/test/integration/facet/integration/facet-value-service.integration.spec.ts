import { Test, TestingModule } from '@nestjs/testing'
import { DbService } from '@avara/shared/database/db-service'
import { RequestContext } from '@avara/core/application/context/request-context'
import { faker } from '@faker-js/faker'
import { FacetValueService } from '@avara/core/domain/facet/application/services/facet-value.service'
import { PaginationUtils } from '@avara/shared/utils/pagination.util'
import {
  CreateFacetValueDto,
  EditFacetValueDto,
} from '@avara/core/domain/facet/api/graphql/dto/create-facet-value.dto'
import { ConfigService } from '@nestjs/config'
import { ChannelRepository } from '@avara/core/domain/channel/infrastructure/repositories/channel.repository'
import { ChannelMapper } from '@avara/core/domain/channel/infrastructure/mappers/channel.mapper'
import { getDefaultChannel } from '../../helpers/save-and-get-default-channel'

describe('FacetValueService (Integration)', () => {
  let facetValueService: FacetValueService
  let dbService: DbService
  let ctx: RequestContext

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacetValueService,
        DbService,
        PaginationUtils,
        ConfigService,
        ChannelRepository,
        ChannelMapper,
      ],
    }).compile()

    facetValueService = module.get<FacetValueService>(FacetValueService)
    dbService = module.get<DbService>(DbService)

    ctx = await getDefaultChannel(dbService)

    await dbService.facetValue.deleteMany()
    await dbService.facet.deleteMany()
  })

  afterEach(async () => {
    await dbService.facetValue.deleteMany()
    await dbService.facet.deleteMany()
  })

  afterAll(async () => {
    await dbService.$disconnect()
  })

  const createRandomFacetValue = (facetId: string): CreateFacetValueDto => ({
    facetId: facetId,
    name: faker.commerce.productName(),
    code: faker.string.alphanumeric(10),
  })

  it('should create a new facet value', async () => {
    // Create a facet for association
    const facet = await dbService.facet.create({
      data: {
        name: faker.commerce.productAdjective(),
        code: faker.string.alphanumeric(10),
        isPrivate: false,
        channels: {
          connect: { id: ctx.channelId },
        },
      },
    })

    const createFacetValueDto = createRandomFacetValue(facet.id)

    const createdFacetValue = await facetValueService.createFacetValue(
      ctx,
      createFacetValueDto,
    )

    expect(createdFacetValue).toBeDefined()
    expect(createdFacetValue.name).toBe(createFacetValueDto.name)
    expect(createdFacetValue.code).toBe(createFacetValueDto.code)
    expect(createdFacetValue.facetId).toBe(createFacetValueDto.facetId)
  })

  it('should retrieve a facet value by ID', async () => {
    // Create a facet for association
    const facet = await dbService.facet.create({
      data: {
        name: faker.commerce.productAdjective(),
        code: faker.string.alphanumeric(10),
        isPrivate: false,
        channels: {
          connect: { id: ctx.channelId },
        },
      },
    })

    const createFacetValueDto = createRandomFacetValue(facet.id)

    const createdFacetValue = await facetValueService.createFacetValue(
      ctx,
      createFacetValueDto,
    )

    const fetchedFacetValue = await facetValueService.getFacetValueById(
      ctx,
      createdFacetValue.id,
    )

    expect(fetchedFacetValue).toBeDefined()
    expect(fetchedFacetValue?.id).toBe(createdFacetValue.id)
  })

  it('should return paginated facet values', async () => {
    // Create a facet for association
    const facet = await dbService.facet.create({
      data: {
        name: faker.commerce.productAdjective(),
        code: faker.string.alphanumeric(10),
        isPrivate: false,
        channels: {
          connect: { id: ctx.channelId },
        },
      },
    })

    for (let i = 0; i < 5; i++) {
      await facetValueService.createFacetValue(
        ctx,
        createRandomFacetValue(facet.id),
      )
    }

    const paginationParams = { limit: 3, position: 0 }
    const paginatedFacetValues =
      await facetValueService.getFacetValuesWithPagination(
        ctx,
        paginationParams,
      )

    expect(paginatedFacetValues.items.length).toBe(3)
    expect(paginatedFacetValues.pagination.total).toBe(5)
  })

  it('should update a facet value', async () => {
    // Create a facet for association
    const facet = await dbService.facet.create({
      data: {
        name: faker.commerce.productAdjective(),
        code: faker.string.alphanumeric(10),
        isPrivate: false,
        channels: {
          connect: { id: ctx.channelId },
        },
      },
    })

    const createFacetValueDto = createRandomFacetValue(facet.id)

    const createdFacetValue = await facetValueService.createFacetValue(
      ctx,
      createFacetValueDto,
    )

    const updatedData: EditFacetValueDto = {
      id: createdFacetValue.id,
      facetId: facet.id,
      name: faker.commerce.productName(),
      code: faker.string.alphanumeric(10),
    }

    const updatedFacetValue = await facetValueService.editFacetValue(
      ctx,
      updatedData,
    )

    expect(updatedFacetValue).toBeDefined()
    expect(updatedFacetValue.id).toBe(createdFacetValue.id)
    expect(updatedFacetValue.name).toBe(updatedData.name)
    expect(updatedFacetValue.code).toBe(updatedData.code)
  })

  it('should delete a facet value', async () => {
    // Create a facet for association
    const facet = await dbService.facet.create({
      data: {
        name: faker.commerce.productAdjective(),
        code: faker.string.alphanumeric(10),
        isPrivate: false,
        channels: {
          connect: { id: ctx.channelId },
        },
      },
    })

    const createFacetValueDto = createRandomFacetValue(facet.id)

    const createdFacetValue = await facetValueService.createFacetValue(
      ctx,
      createFacetValueDto,
    )

    const deletedFacetValue = await facetValueService.deleteFacetValue(
      ctx,
      createdFacetValue.id,
    )

    expect(deletedFacetValue).toBeDefined()
    expect(deletedFacetValue.id).toBe(createdFacetValue.id)

    const fetchedFacetValue = await facetValueService.getFacetValueById(
      ctx,
      createdFacetValue.id,
    )
    expect(fetchedFacetValue).toBeNull()
  })
})
