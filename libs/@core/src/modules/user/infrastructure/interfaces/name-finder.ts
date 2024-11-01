export interface NameFinderRepository<T> {
  findByName(name: string): Promise<T | null>
}
