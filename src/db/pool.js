// src/db/pool.js
// Koneksi ke Neon Database — sengaja dibuat identik dengan db/pool.js
// pada proyek lama (openapi-neon-project) supaya connection string dan
// perilaku koneksinya tetap kompatibel dengan database yang sama.

const { Pool } = require("@neondatabase/serverless");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  console.warn(
    "[WARNING] DATABASE_URL belum di-set. Salin .env.example menjadi .env lalu isi dengan connection string Neon yang sama seperti proyek lama."
  );
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = pool;
