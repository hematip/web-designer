// Pick storage from the environment: DATABASE_URL (or POSTGRES_URL) → Postgres, else SQLite file.
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

export function databaseUrl(env = process.env) {
  return env.DATABASE_URL || env.POSTGRES_URL || env.POSTGRES_URL_NON_POOLING || '';
}

export async function openStoreFromEnv(env = process.env) {
  const url = databaseUrl(env);
  if (url) {
    const { connectPg, openPgStore } = await import('./store-pg.js');
    return openPgStore(await connectPg(url));
  }
  const { openSqliteStore } = await import('./store-sqlite.js');
  return openSqliteStore(env.DB_FILE || join(here, '..', 'data', 'nokhodchi.db'));
}
