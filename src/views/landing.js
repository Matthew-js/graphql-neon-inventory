// src/views/landing.js
// Halaman sambutan sederhana di "/" — tampilan baru untuk menggantikan
// respons JSON polos dari proyek lama.

function landingPage() {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GraphQL Neon Inventory</title>
  <style>
    :root {
      --bg: #0f172a;
      --card: #1e293b;
      --accent: #38bdf8;
      --text: #e2e8f0;
      --muted: #94a3b8;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at top, #1e293b, var(--bg));
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--text);
      padding: 24px;
    }
    .card {
      max-width: 640px;
      width: 100%;
      background: var(--card);
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.35);
    }
    .badge {
      display: inline-block;
      background: rgba(56, 189, 248, 0.15);
      color: var(--accent);
      padding: 4px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    h1 { margin: 0 0 8px; font-size: 26px; }
    p { color: var(--muted); line-height: 1.6; }
    code {
      background: #0f172a;
      border: 1px solid #334155;
      padding: 2px 8px;
      border-radius: 6px;
      color: var(--accent);
      font-size: 13px;
    }
    a.button {
      display: inline-block;
      margin-top: 20px;
      margin-right: 10px;
      padding: 10px 18px;
      background: var(--accent);
      color: #0f172a;
      font-weight: 600;
      text-decoration: none;
      border-radius: 10px;
      font-size: 14px;
    }
    a.button.secondary {
      background: transparent;
      color: var(--accent);
      border: 1px solid var(--accent);
    }
    .schema {
      margin-top: 24px;
      font-size: 12px;
      color: var(--muted);
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">GraphQL &middot; Neon &middot; Apollo Server</span>
    <h1>GraphQL Inventory API</h1>
    <p>
      Rewrite dari REST API lama, sekarang lewat GraphQL. Terhubung ke
      database Neon yang sama seperti sebelumnya — tabel <code>items</code>
      lama tetap utuh, ditambah tabel <code>categories</code> yang saling
      berelasi.
    </p>
    <a class="button" href="/graphql">Buka Apollo Sandbox</a>
    <a class="button secondary" href="https://github.com" target="_blank" rel="noreferrer">Dokumentasi</a>
    <div class="schema">
      Endpoint GraphQL: <code>/graphql</code> &middot; Query contoh:
      <code>{ categories { name items { name price } } }</code>
    </div>
  </div>
</body>
</html>`;
}

module.exports = landingPage;
