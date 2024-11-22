import { Test, TestingModule } from '@nestjs/testing'
import { DbService } from '@avara/shared/database/db-service'
import { RequestContext } from '@avara/core/application/context/request-context'
import { faker } from '@faker-js/faker'
import { FacetService } from '@avara/core/domain/facet/application/services/facet.service'
import { PaginationUtils } from '@avara/shared/utils/pagination.util'
import {
  CreateFacetDto,
  EditFacetDto,
} from '@avara/core/domain/facet/api/graphql/dto/create-facet.dto'
import { ConfigService } from '@nestjs/config'
import { ChannelRepository } from '@avara/core/domain/channel/infrastructure/repositories/channel.repository'
import { ChannelMapper } from '@avara/core/domain/channel/infrastructure/mappers/channel.mapper'
import { getDefaultChannel } from '../../helpers/save-and-get-default-channel'

describe('FacetService (Integration)', () => {
  let facetService: FacetService
  let dbService: DbService
  let ctx: RequestContext

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacetService,
        DbService,
        PaginationUtils,
        DbService,
        ConfigService,
        ChannelRepository,
        ChannelMapper,
      ],
    }).compile()

    facetService = module.get<FacetService>(FacetService)
    dbService = module.get<DbService>(DbService)

    ctx = await getDefaultChannel(dbService)

    await dbService.facetValue.deleteMany()
    await dbService.facet.deleteMany()
  })

  afterEach(async () => {
    await dbService.facet.deleteMany()
    await dbService.facetValue.deleteMany()
  })

  afterAll(async () => {
    await dbService.$disconnect()
  })

  const createRandomFacet = (): CreateFacetDto => ({
    name: faker.commerce.productAdjective(),
    code: faker.string.alphanumeric(10),
    isPrivate: faker.datatype.boolean(),
  })

  it('should create a new facet', async () => {
    const createFacetDto = createRandomFacet()

    const createdFacet = await facetService.createNewFacet(ctx, createFacetDto)

    expect(createdFacet).toBeDefined()
    expect(createdFacet.name).toBe(createFacetDto.name)
    expect(createdFacet.code).toBe(createFacetDto.code)
    expect(createdFacet.isPrivate).toBe(createFacetDto.isPrivate)
  })

  it('should retrieve a facet by ID', async () => {
    const createFacetDto = createRandomFacet()

    const createdFacet = await facetService.createNewFacet(ctx, createFacetDto)

    const fetchedFacet = await facetService.getFacetById(ctx, createdFacet.id)

    expect(fetchedFacet).toBeDefined()
    expect(fetchedFacet?.id).toBe(createdFacet.id)
  })

  it('should return paginated facets', async () => {
    for (let i = 0; i < 5; i++) {
      await facetService.createNewFacet(ctx, createRandomFacet())
    }

    const paginationParams = { limit: 3, position: 0 }
    const paginatedFacets = await facetService.getFacetsWithPagination(
      ctx,
      paginationParams,
    )

    expect(paginatedFacets.items.length).toBe(3)
    expect(paginatedFacets.pagination.total).toBe(5)
  })

  it('should update a facet', async () => {
    const createFacetDto = createRandomFacet()

    const createdFacet = await facetService.createNewFacet(ctx, createFacetDto)

    const id = createdFacet.id
    const updatedData: EditFacetDto = {
      name: faker.commerce.productAdjective(),
      code: faker.string.alphanumeric(10),
      isPrivate: !createdFacet.isPrivate,
    }

    const updatedFacet = await facetService.editFacet(ctx, id, updatedData)

    expect(updatedFacet).toBeDefined()
    expect(updatedFacet.id).toBe(createdFacet.id)
    expect(updatedFacet.name).toBe(updatedData.name)
    expect(updatedFacet.code).toBe(updatedData.code)
    expect(updatedFacet.isPrivate).toBe(updatedData.isPrivate)
  })

  it('should delete a facet', async () => {
    const createFacetDto = createRandomFacet()

    const createdFacet = await facetService.createNewFacet(ctx, createFacetDto)

    const deletedFacet = await facetService.deleteFacet(ctx, createdFacet.id)

    expect(deletedFacet).toBeDefined()
    expect(deletedFacet.id).toBe(createdFacet.id)

    const fetchedFacet = await facetService.getFacetById(ctx, createdFacet.id)
    expect(fetchedFacet).toBeNull()
  })
})
