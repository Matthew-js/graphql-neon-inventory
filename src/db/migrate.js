// src/db/migrate.js
// Migrasi ADITIF (aman) untuk database Neon yang SUDAH ADA.
// Jalankan sekali: npm run migrate
//
// Apa yang dilakukan skrip ini:
//   1. Membuat tabel BARU "categories" — tidak menyentuh tabel lain.
//   2. Menambahkan kolom BARU "category_id" ke tabel "items" yang lama,
//      memakai ADD COLUMN IF NOT EXISTS (nullable, tanpa default yang
//      mengubah nilai baris lama). Data & kolom "items" yang sudah ada
//      (name, description, price, created_at, updated_at) TIDAK diubah,
//      tidak dihapus, dan tidak di-drop.
//   3. Kolom "category_id" bernilai NULL untuk semua item lama —
//      artinya data lama tetap valid dan tidak wajib dikelompokkan.
//
// Tabel "categories" ditambahkan supaya skema punya minimal dua tabel
// yang saling berelasi (items -> categories), sesuai kebutuhan lab
// GraphQL untuk mempraktikkan nested query & resolver relasi.

const pool = require("./pool");

const statements = [
  `CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  );`,
  `ALTER TABLE items
     ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES categories(id);`,
];

async function migrate() {
  try {
    for (const sql of statements) {
      await pool.query(sql);
    }
    console.log("Tabel 'categories' siap & kolom relasi 'items.category_id' ditambahkan.");
    console.log("   (Kolom/baris lama pada 'items' tidak diubah maupun dihapus.)");

    const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM categories");
    if (rows[0].count === 0) {
      await pool.query(
        `INSERT INTO categories (name, description) VALUES
         ('Umum', 'Kategori default untuk item yang belum dikelompokkan'),
         ('Elektronik', 'Perangkat dan aksesori elektronik')`
      );
      console.log("Dua kategori contoh ditambahkan (data 'items' lama tidak disentuh).");
    } else {
      console.log("Tabel 'categories' sudah berisi data, tidak menambah data contoh lagi.");
    }

    const { rows: itemRows } = await pool.query("SELECT COUNT(*)::int AS count FROM items");
    console.log(`Tabel 'items' tetap berisi ${itemRows[0].count} baris seperti sebelumnya.`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Migrasi gagal:", err.message);
    process.exit(1);
  }
}

migrate();
