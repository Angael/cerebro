import sharp from 'sharp';
import logger from '@/utils/log.js';
import { S3Delete, S3SimpleUpload } from '@/aws/s3-helpers.js';
import { makeS3Path, replaceFileWithHash } from '@/utils/makeS3Path.js';
import { MyFile, uploadPayload } from './upload.type.js';
import { db } from '@cerebro/db';
import { HTTPException } from 'hono/http-exception';

type Analysis = {
  width: number;
  height: number;
  animated: boolean;
};

async function insertIntoDb(s3Key: string, itemData: Analysis, file: MyFile, userId: string) {
  const { insertId } = await db
    .insertInto('item')
    .values({
      type: 'IMAGE',
      private: false,
      user_id: userId,
      processed: 'NO',
    })
    .executeTakeFirstOrThrow();

  await db
    .insertInto('image')
    .values({
      item_id: Number(insertId),
      media_type: 'SOURCE',
      path: s3Key,
      size: file.size,
      width: itemData.width,
      height: itemData.height,
    })
    .execute();
}

async function analyze(file: MyFile): Promise<Analysis> {
  const pipeline = sharp(file.path);

  return pipeline.metadata().then(async (metadata) => {
    const frameHeight = metadata.pageHeight ?? metadata.height ?? 0;
    const frameWidth = metadata.width ?? 0;
    const isAnimated = metadata.pages ? metadata.pages > 1 : false;

    return {
      width: frameWidth,
      height: frameHeight,
      animated: isAnimated,
    };
  });
}

export async function uploadImage({ file, userId }: uploadPayload) {
  const imageData = await analyze(file);

  const key = makeS3Path(userId, 'source', replaceFileWithHash(file.originalname));

  await S3SimpleUpload({
    key,
    filePath: file.path,
  });

  try {
    await insertIntoDb(key, imageData, file, userId);

    return { path: key };
  } catch (e) {
    logger.error('Failed to insert image into DB, %O', e);
    S3Delete(file.path);
    throw new HTTPException(500, { message: 'Failed to insert image into DB' });
  }
}
