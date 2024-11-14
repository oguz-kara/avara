export interface NameFinder<T> {
  findOneByNameInChannel(name: string): Promise<T | null>
}
