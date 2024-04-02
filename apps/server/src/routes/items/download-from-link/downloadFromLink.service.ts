import { nanoid } from 'nanoid';
import { downloadVideo, getVideoStats } from 'easy-yt-dlp';
import { env } from '@/utils/env.js';
import { DOWNLOADS_DIR, MAX_UPLOAD_SIZE } from '@/utils/consts.js';
import { MyFile } from '../upload/upload.type.js';
import { parse } from 'path';
import fs from 'fs-extra';
import { HttpError } from '@/utils/errors/HttpError.js';
import { doesUserHaveSpaceLeftForFile } from '../../limits/limits-service.js';
import logger from '@/utils/log.js';
import { betterUnlink } from '@/utils/betterUnlink.js';
import mime from 'mime-types';
import { linkStatsCache } from '@/cache/caches.js';

export const downloadFromLinkService = async (
  link: string,
  userId: number,
  format?: string,
): Promise<MyFile> => {
  const filenameNoExtension = nanoid();
  let { createdFilePath } = await downloadVideo({
    ytDlpPath: env.YT_DLP_PATH,
    link,
    filename: filenameNoExtension,
    outputDir: DOWNLOADS_DIR,
    // maxFileSize: Math.round(MAX_UPLOAD_SIZE / 1000) + 'K',
    format,
  });

  try {
    const filename = parse(createdFilePath).base;
    const file: MyFile = {
      path: createdFilePath,
      size: (await fs.stat(createdFilePath)).size,
      originalname: filename,
      mimetype: String(mime.lookup(createdFilePath)),
      filename,
    };

    if (file.size > MAX_UPLOAD_SIZE) {
      throw new HttpError(413);
    }

    const hasEnoughSpace = await doesUserHaveSpaceLeftForFile(userId, file);

    if (!hasEnoughSpace) {
      throw new HttpError(413);
    }

    return file;
  } catch (e) {
    if (createdFilePath) {
      await betterUnlink(createdFilePath);
    }
    logger.error(e);
    throw e;
  }
};

export const getStatsFromLink = async (link: string) => {
  if (linkStatsCache.has(link)) {
    return linkStatsCache.get(link);
  } else {
    const stats = (await getVideoStats(env.YT_DLP_PATH, link)) as any;
    if (stats) {
      linkStatsCache.set(link, stats);
    }
    return stats;
  }
};
