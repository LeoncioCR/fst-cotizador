import { config } from "dotenv";
import postgres from "postgres";

config({
  path: ".env.local",
});

const connectionString = process.env.DATABASE_MIGRATION_URL;

if (!connectionString) {
  throw new Error("DATABASE_MIGRATION_URL no está configurado");
}

const sql = postgres(connectionString, {
  max: 1,
  ssl: "require",
});

async function main() {
  try {
    const result = await sql`
      select
        current_database() as database,
        current_user as user_name,
        now() as server_time
    `;

    console.log("Conexión correcta:");
    console.table(result);
  } finally {
    await sql.end();
  }
}

main().catch((error) => {
  console.error("Error de conexión:");
  console.error(error);

  process.exit(1);
});
