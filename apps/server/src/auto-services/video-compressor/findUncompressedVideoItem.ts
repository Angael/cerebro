import logger from '../../utils/log.js';
import { db, Item, Video } from '@cerebro/db';

export const findUncompressedVideoItem = async (): Promise<[Item, Video] | []> => {
  const uncompressedItem = await db
    .selectFrom('item')
    .selectAll()
    .where('optimized', '=', 'NO')
    .where('type', '=', 'VIDEO')
    .limit(1)
    .executeTakeFirst();

  if (!uncompressedItem) {
    return [];
  }
  logger.debug('compressing video itemId %i', uncompressedItem.id);

  const sourceVideo = await db
    .selectFrom('video')
    .selectAll()
    .where('item_id', '=', uncompressedItem.id)
    .executeTakeFirstOrThrow();

  return [uncompressedItem, sourceVideo];
};
