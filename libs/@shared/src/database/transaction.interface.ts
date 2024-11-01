export interface ITransaction {
  runInTransaction<T>(operation: (transaction?: any) => Promise<T>): Promise<T>
}
