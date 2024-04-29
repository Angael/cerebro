import z from 'zod';

export const env = z
  .object({
    isProd: z.boolean(),
    NODE_ENV: z.union([z.literal('development'), z.literal('production')]),
    YT_DLP_PATH: z.string(),
    PORT: z.number(),
    CORS_URL: z.string().optional(),
    MOCK_UPLOADS: z.boolean(),
    CF_S3_ENDPOINT: z.string(),
    CF_KEY_ID: z.string(),
    CF_KEY_SECRET: z.string(),
    CF_BUCKET_NAME: z.string(),
    CF_CDN_URL: z.string(),
  })
  .parse({
    NODE_ENV: process.env.NODE_ENV,
    isProd: process.env.NODE_ENV === 'production',
    YT_DLP_PATH: process.env.YT_DLP_PATH || 'yt-dlp',
    PORT: Number(process.env.PORT || '3000'),
    CORS_URL: process.env.CORS_URL,
    MOCK_UPLOADS: process.env.MOCK_UPLOADS === 'true',
    CF_S3_ENDPOINT: process.env.CF_S3_ENDPOINT,
    CF_KEY_ID: process.env.CF_KEY_ID,
    CF_KEY_SECRET: process.env.CF_KEY_SECRET,
    CF_BUCKET_NAME: process.env.CF_BUCKET_NAME,
    CF_CDN_URL: process.env.CF_CDN_URL,
  });
