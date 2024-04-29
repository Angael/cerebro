import { S3Client } from '@aws-sdk/client-s3';
import { S3CreateBucket } from './s3-helpers.js';
import { env } from '@/utils/env.js';
import logger from '@/utils/log.js';

export const s3 = new S3Client({
  region: env.AWS_REGION,

  credentials: {
    accessKeyId: env.AWS_KEY,
    secretAccessKey: env.AWS_SECRET,
  },
});

try {
  await S3CreateBucket(env.AWS_BUCKET_NAME as string);
} catch (e) {
  logger.error('Failed to create bucket', e);
}
