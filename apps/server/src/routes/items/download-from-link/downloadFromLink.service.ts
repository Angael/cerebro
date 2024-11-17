import { linkStatsCache } from '@/cache/caches.js';
import { doesUserHaveSpaceLeftForFile } from '@/routes/user/user.service.js';
import { betterUnlink } from '@/utils/betterUnlink.js';
import { DOWNLOADS_DIR, MAX_UPLOAD_SIZE } from '@/utils/consts.js';
import { env } from '@/utils/env.js';
import logger from '@/utils/log.js';
import { downloadVideo, getVideoStats } from 'easy-yt-dlp';
import fs from 'fs-extra';
import { HTTPException } from 'hono/http-exception';
import mime from 'mime-types';
import { nanoid } from 'nanoid';
import { parse } from 'path';
import { MyFile } from '../upload/upload.type.js';

export const downloadFromLinkService = async (
  link: string,
  userId: string,
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
      throw new HTTPException(413, { message: 'File too big' });
    }

    const hasEnoughSpace = await doesUserHaveSpaceLeftForFile(userId, file);

    if (!hasEnoughSpace) {
      throw new HTTPException(413, { message: 'Not enough space left' });
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
