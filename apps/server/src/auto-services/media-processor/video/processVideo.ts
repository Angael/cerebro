import { mapSeries } from 'modern-async';
import { db, Item, Video } from '@cerebro/db';
import { createThumbnail } from '@vanih/dunes-node';
import { join } from 'path';
import { nanoid } from 'nanoid';
import fs from 'fs-extra';

import { S3Download } from '@/aws/s3-helpers.js';
import {
  IGeneratedThumbnail,
  IThumbnailBeforeUpload,
  IThumbnailMeasure,
} from '@/models/IThumbnail.js';
import { getNameFromS3Path, makeS3Path } from '@/utils/makeS3Path.js';
import { changeExtension } from '@/utils/changeExtension.js';
import { betterUnlink } from '@/utils/betterUnlink.js';
import { uploadThumbnails } from '../uploadThumbnails.js';
import { calculateThumbnailDimensions } from '@/utils/calculateThumbnailDimensions.js';
import { THUMBNAILS_DIR } from '@/utils/consts.js';
import logger from '@/utils/log.js';

function fetchDetails(item: Item) {
  return db
    .selectFrom('video')
    .selectAll()
    .where('item_id', '=', item.id)
    .where('media_type', '=', 'SOURCE')
    .executeTakeFirstOrThrow();
}

type UploadedThumbnail = { dimension: IThumbnailMeasure; outPath: string };

async function generateThumbnails(video: Video, path: string): Promise<IGeneratedThumbnail[]> {
  const dimensions = calculateThumbnailDimensions(video.width, video.height);

  const dimensionsWithPath: UploadedThumbnail[] = dimensions.map((dimension) => ({
    dimension,
    outPath: join(THUMBNAILS_DIR, nanoid() + '.webp'),
  }));

  try {
    const result = mapSeries(
      dimensionsWithPath,
      async ({ dimension, outPath }: UploadedThumbnail) => {
        const { width, height } = dimension;

        await createThumbnail(path, outPath, {
          height,
          width,
        });

        const { size } = await fs.stat(outPath);

        const generatedThumbnail: IGeneratedThumbnail = {
          dimensions: dimension,
          size,
          animated: false,
          diskPath: outPath,
        };

        return generatedThumbnail;
      },
    );

    return result;
  } catch (e) {
    betterUnlink(dimensionsWithPath.map((t) => t.outPath));
    logger.error('Failed to generate thumbnails for video %o', video);
    throw new Error('Failed to generate thumbnails');
  }
}

export async function processVideo(item: Item) {
  const videoRow = await fetchDetails(item);
  const download = await S3Download(videoRow.path);

  try {
    const generatedThumbs = await generateThumbnails(videoRow, download);

    let thumbnails: IThumbnailBeforeUpload[] = generatedThumbs.map((t) => ({
      thumbnail: {
        item_id: item.id,
        type: t.dimensions.type,
        width: t.dimensions.width,
        height: t.dimensions.height,
        path: makeS3Path(
          item.user_id,
          t.dimensions.type,
          changeExtension(getNameFromS3Path(videoRow.path), 'webp'),
        ),
        size: t.size,
      },
      diskPath: t.diskPath,
    }));

    try {
      await uploadThumbnails(thumbnails);
    } catch (e) {
      logger.error('Failed to uploadThumbnails %o', e);
      throw e;
    } finally {
      betterUnlink(thumbnails.map((t) => t.diskPath));
    }
  } catch (e) {
    logger.error('Failed to generateThumbnails %o', e);
    throw e;
  } finally {
    betterUnlink(download);
  }
}
