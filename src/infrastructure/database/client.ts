import "server-only";

import {
  drizzle,
} from "drizzle-orm/postgres-js";

import postgres from "postgres";

const databaseUrl =
  process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL no está configurado",
  );
}

const client = postgres(
  databaseUrl,
  {
    /*
     * No definimos max.
     *
     * postgres-js administrará
     * automáticamente su pool.
     *
     * De esta forma:
     *
     * - una consulta simple utiliza
     *   lo necesario;
     *
     * - Promise.all puede ejecutar
     *   consultas concurrentes;
     *
     * - no forzamos todas las consultas
     *   a pasar por una sola conexión.
     */

    prepare: false,

    ssl: "require",

    /*
     * Una conexión que queda sin utilizar
     * puede liberarse después de este tiempo.
     */
    idle_timeout: 20,

    /*
     * Evita esperar demasiado si no
     * se logra abrir una conexión.
     */
    connect_timeout: 10,
  },
);

export const db =
  drizzle(client);