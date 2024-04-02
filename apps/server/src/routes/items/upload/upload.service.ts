import { betterUnlink } from '../../../utils/betterUnlink.js';
import logger from '../../../utils/log.js';
import { uploadImage } from './image.service.js';
import { uploadVideo } from './video.service.js';
import { Item, ItemType } from '@cerebro/db';
import { HttpError } from '../../../utils/errors/HttpError.js';
import { usedSpaceCache } from '../../../cache/userCache.js';
import { MyFile, uploadPayload } from './upload.type.js';

function getFileType(file: MyFile): ItemType {
  const { mimetype } = file;

  if (['image/png', 'image/gif', 'image/webp', 'image/jpeg'].includes(mimetype)) {
    return 'IMAGE';
  } else if (['video/mp4', 'video/webm'].includes(mimetype)) {
    return 'VIDEO';
  } else {
    throw new HttpError(415);
    // return ItemType.file;
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
    throw new HttpError(400);
  } finally {
    betterUnlink(file.path);
  }

  if (!path) {
    throw new HttpError(500);
  }
}
