import logger from '../utils/log.js';
import {
  PutObjectCommandInput,
  ListBucketsCommand,
  CreateBucketCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import fs from 'fs-extra';
import { s3 } from './s3.js';
import path from 'path';
import { DOWNLOADS_DIR } from '../utils/consts.js';
import { downloadFile } from '../utils/downloadFile.js';
import { s3PathToUrl } from '../utils/s3PathToUrl.js';
import { nanoid } from 'nanoid';
import { getContentType } from './getContentType.js';
import { env } from '@/utils/env.js';

export async function S3CreateBucket(bucket: string) {
  const { Buckets } = await s3.send(new ListBucketsCommand());

  const isAlreadyCreated = Buckets && Buckets.some((b) => b.Name === bucket);

  if (!isAlreadyCreated) {
    logger.warn(`Bucket not found! Creating one now...`, { bucket, Buckets });
    try {
      await s3.send(
        new CreateBucketCommand({
          Bucket: bucket,
          ACL: 'public-read',
        }),
      );
      logger.info(`Created public S3 bucket`, { bucket });
    } catch (e) {
      logger.error(`Failed to create public bucket`, { bucket });
    }
  } else {
    logger.verbose(`Bucket found`, { bucket });
  }
  // make public
}

export function S3SimpleUpload({
  key,
  filePath,
}: {
  key: string;
  filePath: string;
}): Promise<void> {
  const params: PutObjectCommandInput = {
    Bucket: env.CF_BUCKET_NAME,
    Key: key,
    Body: fs.createReadStream(filePath),
    ACL: 'public-read',
    ContentType: getContentType(filePath),
  };

  try {
    return s3.send(new PutObjectCommand(params)).then(() => {
      logger.verbose(`Uploaded to s3 %s`, key);
    });
  } catch (e) {
    logger.error(`Failed to upload to s3 %s`, filePath);
    throw e;
  }
}

export function S3Delete(Key: string): Promise<void> {
  const params = {
    Bucket: env.CF_BUCKET_NAME,
    Key,
  };

  try {
    return s3.send(new DeleteObjectCommand(params)).then(() => {
      logger.verbose(`Deleted from s3 %s`, Key);
    });
  } catch (e) {
    logger.error(`Failed to delete object %s`, Key);
    throw e;
  }
}

export function S3DeleteMany(keys: string[]): Promise<void> {
  if (keys.length === 0) {
    return Promise.resolve();
  }

  const params = {
    Bucket: env.CF_BUCKET_NAME,
    Delete: {
      Objects: keys.map((Key) => ({ Key })),
      Quiet: false,
    },
  };

  try {
    return s3.send(new DeleteObjectsCommand(params)).then(() => {
      logger.verbose(`Deleted from s3 %o`, keys);
    });
  } catch (e) {
    logger.error(`Failed to delete some objects %o`, keys);
    throw e;
  }
}

export async function S3Download(s3Path: string): Promise<string> {
  const extension = path.extname(s3Path);
  if (!extension) {
    throw new Error('file has no extension');
  }

  try {
    const url = s3PathToUrl(s3Path);
    const downloadDestination = DOWNLOADS_DIR + '/' + nanoid() + extension;
    await downloadFile(url, downloadDestination);
    return downloadDestination;
  } catch (e: any) {
    logger.error(e);
    throw new Error(e);
  }
}
