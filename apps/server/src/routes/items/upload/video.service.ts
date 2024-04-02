import logger from '@/utils/log.js';
import { S3Delete, S3SimpleUpload } from '@/aws/s3-helpers.js';
import { makeS3Path, replaceFileWithHash } from '@/utils/makeS3Path.js';
import { db } from '@cerebro/db';
import { analyzeVideo, VideoStats } from '@vanih/dunes-node';
import { HttpError } from '@/utils/errors/HttpError.js';
import { MyFile, uploadPayload } from './upload.type.js';

async function insertIntoDb(s3Key: string, videoData: VideoStats, file: MyFile, userId: string) {
  const { insertId } = await db
    .insertInto('item')
    .values({
      type: 'VIDEO',
      private: false,
      user_id: userId,
      processed: 'NO',
    })
    .executeTakeFirstOrThrow();

  await db
    .insertInto('video')
    .values({
      item_id: Number(insertId),
      media_type: 'SOURCE',
      path: s3Key,
      size: file.size,
      width: videoData.width,
      height: videoData.height,
      duration_ms: videoData.durationMs,
      bitrate_kb: videoData.bitrateKb,
    })
    .execute();
}

export async function uploadVideo({ file, userId }: uploadPayload) {
  const videoData = await analyzeVideo(file.path);

  const key = makeS3Path(userId, 'source', replaceFileWithHash(file.originalname));

  await S3SimpleUpload({
    key,
    filePath: file.path,
  });

  try {
    await insertIntoDb(key, videoData, file, userId);
    return { path: key };
  } catch (e: any) {
    logger.error('Failed to insert video into DB. Error: %o', e.message);
    await S3Delete(file.path);
    throw new HttpError(500);
  }
}
