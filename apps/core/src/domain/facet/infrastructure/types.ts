import { Facet, FacetValue } from '@prisma/client'
export { Facet, FacetValue } from '@prisma/client'

export type FacetWithValues = Facet & { values: FacetValue[] }
