import { z } from 'zod';

export const env = z
  .object({
    API_URL: z.string(),
  })
  .parse({
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  });
