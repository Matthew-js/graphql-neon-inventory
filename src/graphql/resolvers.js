const pool = require("../db/pool");

function mapItem(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price !== null ? Number(row.price) : 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    category_id: row.category_id,
  };
}

function mapCategory(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    description: row.description,
  };
}

let resolverCallCount = 0;

const resolvers = {
  Query: {
    items: async (_parent, { categoryId }) => {
      if (categoryId) {
        const { rows } = await pool.query(
          "SELECT * FROM items WHERE category_id = $1 ORDER BY id ASC",
          [categoryId]
        );
        return rows.map(mapItem);
      }
      const { rows } = await pool.query("SELECT * FROM items ORDER BY id ASC");
      return rows.map(mapItem);
    },

    item: async (_parent, { id }) => {
      const { rows } = await pool.query("SELECT * FROM items WHERE id = $1", [id]);
      return mapItem(rows[0]);
    },

    categories: async () => {
      // Reset counter di sini: Query.categories adalah ROOT resolver yang
      // selalu dipanggil lebih dulu, jadi ini titik awal yang pas untuk
      // mulai menghitung ulang dari 0 setiap kali ada query baru.
      resolverCallCount = 0;
      console.log("[N+1 counter] Query.categories dipanggil (root resolver) — counter direset ke 0");

      const { rows } = await pool.query("SELECT * FROM categories ORDER BY id ASC");
      console.log(`[N+1 counter] Ditemukan ${rows.length} kategori (ini prediksi N)`);
      return rows.map(mapCategory);
    },

    category: async (_parent, { id }) => {
      const { rows } = await pool.query("SELECT * FROM categories WHERE id = $1", [id]);
      return mapCategory(rows[0]);
    },
  },

  Mutation: {
    createItem: async (_parent, { name, description, price, categoryId }) => {
      const { rows } = await pool.query(
        `INSERT INTO items (name, description, price, category_id)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [name, description || null, price ?? 0, categoryId || null]
      );
      return mapItem(rows[0]);
    },

    updateItem: async (_parent, { id, name, description, price, categoryId }) => {
      const { rows } = await pool.query(
        `UPDATE items
           SET name = COALESCE($1, name),
               description = COALESCE($2, description),
               price = COALESCE($3, price),
               category_id = COALESCE($4, category_id),
               updated_at = NOW()
         WHERE id = $5
         RETURNING *`,
        [name, description, price, categoryId, id]
      );
      if (rows.length === 0) {
        throw new Error(`Item dengan id ${id} tidak ditemukan`);
      }
      return mapItem(rows[0]);
    },

    deleteItem: async (_parent, { id }) => {
      const { rows } = await pool.query(
        "DELETE FROM items WHERE id = $1 RETURNING *",
        [id]
      );
      return rows.length > 0;
    },

    createCategory: async (_parent, { name, description }) => {
      const { rows } = await pool.query(
        `INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *`,
        [name, description || null]
      );
      return mapCategory(rows[0]);
    },

    updateCategory: async (_parent, { id, name, description }) => {
      const { rows } = await pool.query(
        `UPDATE categories
           SET name = COALESCE($1, name),
               description = COALESCE($2, description)
         WHERE id = $3
         RETURNING *`,
        [name, description, id]
      );
      if (rows.length === 0) {
        throw new Error(`Kategori dengan id ${id} tidak ditemukan`);
      }
      return mapCategory(rows[0]);
    },

    deleteCategory: async (_parent, { id }) => {
      const { rows } = await pool.query(
        "DELETE FROM categories WHERE id = $1 RETURNING *",
        [id]
      );
      return rows.length > 0;
    },
  },

  Item: {
    category: async (parent) => {
      if (!parent.category_id) return null;
      const { rows } = await pool.query(
        "SELECT * FROM categories WHERE id = $1",
        [parent.category_id]
      );
      return mapCategory(rows[0]);
    },
  },

  Category: {
    items: async (parent) => {
      resolverCallCount++;
      console.log(
        `[N+1 counter] Category.items dipanggil ke-${resolverCallCount}x (untuk category id=${parent.id}, name="${parent.name}")`
      );

      const { rows } = await pool.query(
        "SELECT * FROM items WHERE category_id = $1 ORDER BY id ASC",
        [parent.id]
      );
      return rows.map(mapItem);
    },
  },
};

module.exports = resolvers;