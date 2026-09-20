import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";

import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL no está configurado");
}

const isDevelopment = process.env.NODE_ENV === "development";

const client = postgres(databaseUrl, {
  /*
   * Desarrollo:
   *
   * Permitimos hasta 3 conexiones para
   * que Promise.all y consultas paralelas
   * no tengan que esperar una sola conexión.
   *
   * Producción:
   *
   * Conservamos una conexión por instancia,
   * adecuada para un entorno serverless.
   */
  max: isDevelopment ? 3 : 1,

  /*
   * Recomendado cuando trabajamos
   * mediante poolers/serverless.
   */
  prepare: false,

  ssl: "require",

  /*
   * Libera conexiones inactivas.
   */
  idle_timeout: 20,

  /*
   * No esperar indefinidamente
   * una conexión.
   */
  connect_timeout: 10,
});

export const db = drizzle(client);
