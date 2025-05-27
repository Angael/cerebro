import { z } from 'zod';

export const serverEnv = z
  .object({
    AUTH_COOKIE_DOMAIN: z.string().nonempty(),
  })
  .parse({
    AUTH_COOKIE_DOMAIN: process.env.AUTH_COOKIE_DOMAIN,
  });
