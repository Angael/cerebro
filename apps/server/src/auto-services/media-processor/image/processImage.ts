import { forEach } from 'modern-async';
import { db, Image, Item } from '@cerebro/db';

import { S3Download, S3SimpleUpload } from '@/aws/s3-helpers.js';
import { IThumbnailBeforeUpload } from '@/models/IThumbnail.js';
import { getNameFromS3Path, makeS3Path } from '@/utils/makeS3Path.js';
import { changeExtension } from '@/utils/changeExtension.js';
import { generateOptimizedSrc, generateThumbnails } from './sharpHelpers.js';
import { betterUnlink } from '@/utils/betterUnlink.js';
import { uploadThumbnails } from '../uploadThumbnails.js';
import logger from '@/utils/log.js';

function fetchDetails(item: Item): Promise<Image> {
  return db
    .selectFrom('image')
    .selectAll()
    .where('item_id', '=', item.id)
    .where('media_type', '=', 'SOURCE')
    .executeTakeFirstOrThrow();
  // .image.findFirstOrThrow({ where: { itemId: item.id, mediaType: 'SOURCE' } });
}

export async function processImage(item: Item) {
  let error = false;

  const imageRow = await fetchDetails(item);
  const download = await S3Download(imageRow.path);

  const sourceFileName = getNameFromS3Path(imageRow.path);

  // Optimized src
  try {
    await db.updateTable('item').set({ optimized: 'STARTED' }).where('id', '=', item.id).execute();

    const { diskPath, width, height, size } = await generateOptimizedSrc(download);

    const s3Path = makeS3Path(item.user_id, 'optimized', changeExtension(sourceFileName, 'webp'));

    await db
      .insertInto('image')
      .values({
        item_id: item.id,
        media_type: 'COMPRESSED',
        path: s3Path,
        size,
        width,
        height,
      })
      .execute();

    await S3SimpleUpload({
      key: s3Path,
      filePath: diskPath,
    });

    await db.updateTable('item').set({ optimized: 'V1' }).where('id', '=', item.id).execute();

    await betterUnlink(diskPath);
  } catch (e) {
    logger.error('Failed to generate optimized src for item.id %i', item.id);
    error = true;
    await db.updateTable('item').set({ optimized: 'FAIL' }).where('id', '=', item.id).execute();
  }

  // TODO if src fails, thumbnails are not generated, is this a problem?

  // Thumbnails
  try {
    const generatedThumbs = await generateThumbnails(download);

    let thumbnails: IThumbnailBeforeUpload[] = generatedThumbs.map((t) => ({
      thumbnail: {
        item_id: item.id,
        type: t.dimensions.type,
        width: t.dimensions.width,
        height: t.dimensions.height,
        path: makeS3Path(item.user_id, t.dimensions.type, changeExtension(sourceFileName, 'webp')),
        size: t.size,
      },
      diskPath: t.diskPath,
    }));

    try {
      await uploadThumbnails(thumbnails);
    } catch (e) {
      logger.error('Failed to upload thumbnails for item.id %i', item.id);
      error = true;
    } finally {
      await forEach(thumbnails, (t) => betterUnlink(t.diskPath));
    }
  } catch (e) {
    logger.error('Failed to generate thumbnails for item.id %i', item.id);
    error = true;
  }

  await betterUnlink(download);

  if (error) {
    throw new Error('Failed to process image');
  }
}
