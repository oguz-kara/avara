import { FacetValueResolver } from './api/graphql/resolvers/facet-value.resolver'
import { FacetResolver } from './api/graphql/resolvers/facet.resolver'
import { FacetValueService } from './application/services/facet-value.service'
import { FacetService } from './application/services/facet.service'

export const FacetProviders = [
  FacetResolver,
  FacetValueResolver,
  FacetService,
  FacetValueService,
]
