import type { Database } from './types.js'; // this is the Database interface we defined earlier
import { createPool } from 'mysql2/promise'; // do not use 'mysql2/promises'!
import { Kysely, MysqlDialect } from 'kysely';
import { z } from 'zod';

const config = z
  .object({
    host: z.string(),
    user: z.string(),
    password: z.string(),
    database: z.string(),
    port: z.number(),
  })
  .parse({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
  });

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
export const db = new Kysely<Database>({
  dialect,
});

export * from './typesZod.js';
export type * from './types.js';
