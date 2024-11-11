export const findChannelsQuery = `
query {
  channels(input: { limit: 10, position: 0 }) {
    items {
      id
      name
      code
    }
    pagination {
      total
      limit
      position
    }
  }
}
`
