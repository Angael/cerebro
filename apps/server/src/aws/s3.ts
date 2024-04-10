import AWS from 'aws-sdk';
import { S3CreateBucket } from './s3-helpers.js';
import { env } from '@/utils/env.js';
import logger from '@/utils/log.js';

AWS.config.update({
  apiVersion: 'latest',
  region: env.AWS_REGION,
  accessKeyId: env.AWS_KEY,
  secretAccessKey: env.AWS_SECRET,
  credentials: {
    accessKeyId: env.AWS_KEY,
    secretAccessKey: env.AWS_SECRET,
  },
});

export const s3 = new AWS.S3();

try {
  await S3CreateBucket(env.AWS_BUCKET_NAME as string);
} catch (e) {
  logger.error('Failed to create bucket', e);
}
