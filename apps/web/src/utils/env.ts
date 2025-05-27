import { z } from 'zod';

export const env = z
  .object({
    IS_PROD: z.boolean(),
    API_URL: z.string().nonempty(),
    SENTRY_DSN: z.string().nonempty(),
    AUTH_COOKIE_DOMAIN: z.string().nonempty(),
  })
  .parse({
    IS_PROD: process.env.NODE_ENV === 'production',
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    AUTH_COOKIE_DOMAIN: process.env.AUTH_COOKIE_DOMAIN,
  });
