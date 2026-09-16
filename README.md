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

## Mutation dan filter (Lab 05)

Server memakai nama entitas `Item` (tabel Neon: `items`). Mutation menerima
input object dan benar-benar menjalankan `INSERT`, `UPDATE`, atau `DELETE` ke
database Neon.

```graphql
mutation CreateItem {
  createItem(input: {
    name: "Item Uji"
    description: "Dibuat untuk verifikasi mutation"
    price: 10000
    categoryId: "1"
  }) {
    id
    name
    price
  }
}
```

Gunakan `id` hasil mutation tersebut untuk pengujian berikut.

```graphql
mutation UpdateItem {
  updateItem(id: "ID_DARI_CREATE", input: { price: 12500 }) {
    id
    name
    price
  }
}

mutation DeleteItem {
  deleteItem(id: "ID_DARI_CREATE")
}
```

Untuk membuktikan perubahan, jalankan query ulang. Argument `categoryId`
bersifat opsional; tanpa argument, semua item dikembalikan.

```graphql
query ItemsByCategory {
  items(categoryId: "1") {
    id
    name
    price
    category { name }
  }
}
```
