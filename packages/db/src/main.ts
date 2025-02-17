import type { Database } from './types.js'; // this is the Database interface we defined earlier
import config from './dbEnv.js';
import { createPool } from 'mysql2/promise'; // do not use 'mysql2/promises'!
import { Kysely, MysqlDialect } from 'kysely';

export const dbPool = createPool({
  ...config,
  connectionLimit: 10,
  typeCast(field, next) {
    if (field.type === 'TINY' && field.length === 1) {
      return field.string() === '1';
    } else {
      return next();
    }
  },
});

const dialect = new MysqlDialect({
  pool: dbPool.pool,
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({ dialect });

export type * from './types.js';
export { applyMigrations } from './migrate.js';
