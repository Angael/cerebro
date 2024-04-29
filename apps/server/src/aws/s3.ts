import { S3Client } from '@aws-sdk/client-s3';
import { S3CreateBucket } from './s3-helpers.js';
import { env } from '@/utils/env.js';
import logger from '@/utils/log.js';

export const s3 = new S3Client({
  region: 'auto',
  endpoint: env.CF_S3_ENDPOINT,

  credentials: {
    accessKeyId: env.CF_KEY_ID,
    secretAccessKey: env.CF_KEY_SECRET,
  },
});

try {
  // Is this code even useful?
  await S3CreateBucket(env.CF_BUCKET_NAME as string);
} catch (e: any) {
  logger.error('Failed to create bucket %s', e?.message);
}
