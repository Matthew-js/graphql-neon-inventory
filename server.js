// server.js
// Entry point baru: Apollo Server (GraphQL) di atas Express, menggantikan
// server.js REST lama. Struktur & tampilan berbeda, tapi tetap terhubung
// ke Neon Database yang sama lewat src/db/pool.js.

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");

const typeDefs = require("./src/graphql/typeDefs");
const resolvers = require("./src/graphql/resolvers");
const landingPage = require("./src/views/landing");

const PORT = process.env.PORT || 4000;

// Origin yang diizinkan CORS. studio.apollographql.com WAJIB ada supaya
// link Apollo Sandbox bisa dibuka dosen/penilai, sesuai checklist lab.
const allowedOrigins = [
  "https://studio.apollographql.com",
  "http://localhost:3000",
  "http://localhost:4000",
];

let appInstance = null;

async function buildApp() {
  const app = express();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // Introspection WAJIB tetap menyala (jangan dimatikan di production)
    // supaya Apollo Sandbox bisa membaca skema lewat URL deployment.
    introspection: true,
  });

  await server.start();

  app.use(
    cors({
      origin: allowedOrigins,
    })
  );

  app.get("/", (_req, res) => {
    res.send(landingPage());
  });

  app.use("/graphql", express.json(), expressMiddleware(server));

  return app;
}

// Vercel (serverless): bangun app sekali, cache antar invocation.
async function getAppForServerless(req, res) {
  if (!appInstance) {
    appInstance = await buildApp();
  }
  return appInstance(req, res);
}

if (process.env.VERCEL) {
  module.exports = (req, res) => getAppForServerless(req, res);
} else {
  // Render / lokal: server Node biasa yang tetap menyala.
  buildApp()
    .then((app) => {
      app.listen(PORT, () => {
        console.log(`GraphQL server berjalan di http://localhost:${PORT}/graphql`);
        console.log(`Landing page: http://localhost:${PORT}/`);
      });
    })
    .catch((err) => {
      console.error("Gagal menjalankan server:", err);
      process.exit(1);
    });

  module.exports = buildApp;
}
