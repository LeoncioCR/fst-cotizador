import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({
  path: ".env.local",
});

const migrationUrl = process.env.DATABASE_MIGRATION_URL;

if (!migrationUrl) {
  throw new Error("DATABASE_MIGRATION_URL no está configurado");
}

export default defineConfig({
  dialect: "postgresql",

  schema: "./src/infrastructure/database/schema",

  out: "./drizzle",

  dbCredentials: {
    url: migrationUrl,
  },

  migrations: {
    schema: "drizzle",
    table: "__drizzle_migrations",
  },

  strict: true,
  verbose: true,
});
