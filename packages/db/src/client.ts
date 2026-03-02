import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

type DB = ReturnType<typeof drizzle<typeof schema>>;

let _db: DB | null = null;

export function getDb(): DB {
  if (!_db) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set');
    }
    _db = drizzle(postgres(connectionString), { schema });
  }
  return _db;
}

export const db = new Proxy({} as DB, {
  get: (_target, prop) => {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
