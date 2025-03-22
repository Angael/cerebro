import z from 'zod';

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

export default config;
