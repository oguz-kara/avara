export interface Mapper<D, P> {
  toPersistence(entity: D): P | Promise<P>
  toDomain(entity: P): D | Promise<D>
}
