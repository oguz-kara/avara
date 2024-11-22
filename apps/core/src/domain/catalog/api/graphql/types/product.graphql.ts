import { AssetType } from '@avara/core/domain/asset/api/graphql/types/asset.graphql'
import { ChannelType } from '@avara/core/domain/channel/api/graphql/types/channel.graphql'
import { FacetValueType } from '@avara/core/domain/facet/api/graphql/types/facet-value.graphql'
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { ProductCollection } from './product-collection.graphql'
import { PaginatedResponseMeta } from '@avara/shared/graphql/types/pagination-response.graphql'

@ObjectType()
export class ProductType {
  @Field(() => ID)
  id: string

  @Field({ nullable: true })
  featuredImageId?: string

  @Field()
  draft: boolean

  @Field()
  name: string

  @Field({ nullable: true })
  slug?: string

  @Field({ nullable: true })
  description?: string

  @Field(() => AssetType, { nullable: true })
  featuredImage?: AssetType

  @Field(() => [AssetType])
  documents: AssetType[]

  @Field(() => [AssetType])
  images: AssetType[]

  @Field(() => [ChannelType])
  channels: ChannelType[]

  @Field(() => [FacetValueType])
  facetValues: FacetValueType[]

  @Field(() => [ProductCollection])
  productCollections: ProductCollection[]

  @Field({ nullable: true })
  createdAt?: Date

  @Field({ nullable: true })
  updatedAt?: Date

  @Field({ nullable: true })
  updatedBy?: string

  @Field({ nullable: true })
  createdBy?: string

  @Field({ nullable: true })
  deletedAt?: Date

  @Field({ nullable: true })
  deletedBy?: string
}

@ObjectType()
export class FindProductsResponseType {
  @Field(() => [ProductType])
  items: ProductType[]

  @Field(() => PaginatedResponseMeta)
  pagination: PaginatedResponseMeta
}
