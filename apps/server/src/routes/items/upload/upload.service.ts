import { ItemType } from '@cerebro/db';

import { betterUnlink } from '@/utils/betterUnlink.js';
import logger from '@/utils/log.js';
import { uploadImage } from './image.service.js';
import { uploadVideo } from './video.service.js';
import { usedSpaceCache } from '@/cache/userCache.js';
import { MyFile, uploadPayload } from './upload.type.js';
import { HTTPException } from 'hono/http-exception';

function getFileType(file: MyFile): ItemType {
  const { mimetype } = file;

  if (['image/png', 'image/gif', 'image/webp', 'image/jpeg'].includes(mimetype)) {
    return 'IMAGE';
  } else if (['video/mp4', 'video/webm'].includes(mimetype)) {
    return 'VIDEO';
  } else {
    throw new HTTPException(415, { message: 'Unsupported file type' });
  }
}

export async function uploadFileForUser({ file, userId }: uploadPayload) {
  let path: string = '';

  try {
    const itemType = getFileType(file);

    if (itemType === 'IMAGE') {
      const result = await uploadImage({ file, userId });
      path = result.path;
    } else if (itemType === 'VIDEO') {
      const result = await uploadVideo({ file, userId });
      path = result.path;
    }
    logger.verbose('uploaded file %s', path);
    usedSpaceCache.del(userId);
  } catch (e) {
    logger.error(e);
    throw new HTTPException(400, { message: 'Failed to upload file' });
  } finally {
    betterUnlink(file.path);
  }

  if (!path) {
    throw new HTTPException(500, { message: 'Failed to upload file' });
  }
}
