# GraphQL Neon Inventory (rewrite dari openapi-neon-project)

Proyek ini adalah **penulisan ulang** dari `openapi-neon-project` (REST API +
Swagger) menjadi **GraphQL server** (Apollo Server), sesuai modul lab
"GraphQL API Sederhana (Render + Neon)". Tampilan dan struktur kode benar-benar
baru, tapi **database Neon dan tabel `items` yang lama tetap dipakai apa
adanya**.

## Ringkasan hasil analisis proyek lama

| Bagian | Proyek lama | Catatan |
|---|---|---|
| Jenis API | REST (Express) + dokumentasi OpenAPI/Swagger | `server.js`, `routes/items.js`, `openapi.yaml` |
| Database | Neon Postgres, 1 tabel: `items` (id, name, description, price, created_at, updated_at) | dibuat lewat `db/init.js` |
| Driver DB | `@neondatabase/serverless` | connection string dari `DATABASE_URL` |
| Fitur | CRUD `items` + hypermedia `_links` (HATEOAS) | `routes/items.js` |
| Deployment | Render / Vercel via `vercel.json` | |

Tidak ada tabel relasi di proyek lama — hanya `items` sendirian. Modul lab
GraphQL mewajibkan **minimal dua tabel yang berelasi** supaya bisa
mempraktikkan *nested query* dan resolver relasi.

## Apa yang berubah, apa yang tidak

**Tidak berubah (kompatibel dengan database lama):**
- Connection string Neon (`DATABASE_URL`) — pakai yang sama persis dengan
  proyek lama, cukup salin ke `.env` proyek ini.
- Tabel `items`: semua kolom lama (`id`, `name`, `description`, `price`,
  `created_at`, `updated_at`) dan **seluruh datanya tetap ada, tidak
  dihapus atau ditimpa**.

**Ditambahkan (aditif, tidak merusak apa pun):**
- Tabel baru `categories` (id, name, description, created_at).
- Satu kolom baru di tabel `items`: `category_id` (nullable, foreign key
  ke `categories.id`). Ditambahkan lewat `ALTER TABLE ... ADD COLUMN IF
  NOT EXISTS`, jadi item lama otomatis bernilai `category_id = NULL` dan
  tetap valid tanpa perlu diubah manual.

**Berubah total (struktur & tampilan program):**
- REST + Swagger → **GraphQL + Apollo Server**.
- Struktur folder baru: `src/db`, `src/graphql`, `src/views`.
- Ada resolver relasi dua arah: `Item.category` dan `Category.items`
  (inilah yang membuat *nested query* bekerja).
- Halaman `/` sekarang tampilan HTML baru, bukan JSON polos.

## Struktur folder

```
graphql-neon-project/
├── server.js                 # entry point Apollo + Express
├── src/
│   ├── db/
│   │   ├── pool.js           # koneksi Neon (identik dgn proyek lama)
│   │   └── migrate.js        # migrasi ADITIF: tabel categories + kolom relasi
│   ├── graphql/
│   │   ├── typeDefs.js       # schema GraphQL (Item, Category, Query, Mutation)
│   │   └── resolvers.js      # resolver, termasuk resolver relasi nested query
│   └── views/
│       └── landing.js        # halaman "/" dengan tampilan baru
├── vercel.json
├── .env.example
└── package.json
```

## Cara menjalankan

1. Install dependency:
   ```bash
   npm install
   ```
2. Salin `.env.example` menjadi `.env`, isi `DATABASE_URL` dengan
   connection string Neon **yang sama seperti proyek lama** (boleh
   copy-paste langsung dari `.env` proyek lama).
3. Jalankan migrasi aditif (sekali saja) untuk menambahkan tabel
   `categories` dan kolom relasi di `items`:
   ```bash
   npm run migrate
   ```
   Skrip ini **tidak** menyentuh baris data `items` yang sudah ada —
   cek log di terminal, akan ditampilkan jumlah baris `items` sebelum &
   sesudah (harus sama).
4. Jalankan server:
   ```bash
   npm start
   ```
5. Buka `http://localhost:4000/graphql` untuk Apollo Sandbox lokal, atau
   `http://localhost:4000/` untuk halaman sambutan.

## Contoh nested query

```graphql
query {
  categories {
    name
    items {
      name
      price
    }
  }
}
```

Item lama yang belum dikategorikan akan otomatis tampil di daftar
`items` biasa (`{ items { name price category { name } } }`) dengan
`category: null`, tanpa kehilangan data apa pun.

## Deploy

**Render (utama, sesuai modul lab):**
1. Push ke GitHub.
2. Di Render, buat "New Web Service", hubungkan repo ini.
3. Build command: `npm install`, Start command: `npm start`.
4. Tambahkan environment variable `DATABASE_URL` (connection string Neon
   yang sama).
5. Setelah deploy, jalankan `npm run migrate` sekali (lewat Render Shell
   atau jalankan lokal dengan `DATABASE_URL` yang sama) sebelum menguji
   nested query lewat URL publik.

**Vercel (alternatif):** `vercel.json` sudah disiapkan mengikuti pola
proyek lama. Karena Vercel serverless, pakai connection string Neon versi
**pooled** (hostname mengandung `-pooler`) supaya tidak kena `connection
limit exceeded`.

## Checklist kompatibilitas database

- [x] Tidak ada `DROP TABLE`, `DELETE`, atau `TRUNCATE` terhadap `items`.
- [x] Tidak ada perubahan tipe data / penghapusan kolom pada `items`.
- [x] Kolom baru (`category_id`) nullable — tidak memaksa data lama diubah.
- [x] Tabel baru (`categories`) dibuat dengan `IF NOT EXISTS`, aman
      dijalankan berkali-kali.
- [x] `DATABASE_URL` proyek baru mengarah ke Neon project yang sama
      dengan proyek lama.
