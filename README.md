https://studio.apollographql.com/sandbox/explorer?endpoint=https://graphql-neon-inventory.vercel.app/graphql


query {
  categories {
    name
    items {
      name
      price
    }
  }
}
