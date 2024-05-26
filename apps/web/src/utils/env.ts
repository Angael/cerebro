import { z } from 'zod';

export const env = z
  .object({
    IS_PROD: z.boolean(),
    API_URL: z.string(),
  })
  .parse({
    IS_PROD: process.env.NODE_ENV === 'production',
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  });
