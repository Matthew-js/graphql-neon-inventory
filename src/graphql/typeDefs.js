// src/graphql/typeDefs.js
// Skema GraphQL untuk dua tabel berelasi: categories (1) -> items (banyak).
// "items" adalah tabel LAMA yang sudah ada di Neon (data tidak diubah),
// "categories" adalah tabel BARU yang ditambahkan lewat migrate.js.

const { gql } = require("graphql-tag");

const typeDefs = gql`
  type Item {
    id: ID!
    name: String!
    description: String
    price: Float!
    createdAt: String
    updatedAt: String
    category: Category
  }

  type Category {
    id: ID!
    name: String!
    description: String
    items: [Item!]!
  }

  type Query {
    "Ambil semua item (opsional filter berdasarkan kategori)"
    items(categoryId: ID): [Item!]!
    item(id: ID!): Item

    categories: [Category!]!
    category(id: ID!): Category
  }

  type Mutation {
    createItem(
      name: String!
      description: String
      price: Float
      categoryId: ID
    ): Item!

    updateItem(
      id: ID!
      name: String
      description: String
      price: Float
      categoryId: ID
    ): Item!

    deleteItem(id: ID!): Boolean!

    createCategory(name: String!, description: String): Category!
    updateCategory(id: ID!, name: String, description: String): Category!
    deleteCategory(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
