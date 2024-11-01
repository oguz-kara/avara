export interface Mapper<D, P> {
  toPersistence(entity: D): P
  toDomain(entity: P): D
}
