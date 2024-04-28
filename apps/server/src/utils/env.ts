import z from 'zod';

export const env = z
  .object({
    isProd: z.boolean(),
    NODE_ENV: z.union([z.literal('development'), z.literal('production')]),
    YT_DLP_PATH: z.string(),
    PORT: z.number(),
    CORS_URL: z.string().optional(),
    AWS_USER: z.string(),
    AWS_KEY: z.string(),
    AWS_SECRET: z.string(),
    AWS_BUCKET_NAME: z.string(),
    AWS_REGION: z.string(),
    MOCK_UPLOADS: z.boolean(),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_PUBLIC_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
  })
  .parse({
    NODE_ENV: process.env.NODE_ENV,
    isProd: process.env.NODE_ENV === 'production',
    YT_DLP_PATH: process.env.YT_DLP_PATH || 'yt-dlp',
    PORT: Number(process.env.PORT || '3000'),
    CORS_URL: process.env.CORS_URL,
    AWS_USER: process.env.AWS_USER,
    AWS_KEY: process.env.AWS_KEY,
    AWS_SECRET: process.env.AWS_SECRET,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_REGION: process.env.AWS_REGION,
    MOCK_UPLOADS: process.env.MOCK_UPLOADS === 'true',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  });
