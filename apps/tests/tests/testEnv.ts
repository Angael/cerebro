import z from 'zod';

const envSchema = z.object({
  DOMAIN: z.string(),
  TEST_EMAIL: z.string(),
  TEST_PASS: z.string(),
});

export const testEnv = envSchema.parse(process.env);
