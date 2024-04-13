import logger from '../../utils/log.js';
import { BaseProcessor } from '../base-processor/BaseProcessor.js';
import { db, Item } from '@cerebro/db';
import { processImage } from './image/processImage.js';
import { processVideo } from './video/processVideo.js';

const mediaProcessor = new BaseProcessor<Item>({
  concurrency: 1,
  processItem: async (item: Item) => {
    if (item.type === 'IMAGE') {
      await processImage(item);
    } else if (item.type === 'VIDEO') {
      await processVideo(item);
    } else {
      throw new Error('Tried to optimize unsupported unknown filetype');
    }
  },
  checkInterval: 5000,

  getItems: () => {
    return db.selectFrom('item').selectAll().where('processed', '=', 'NO').limit(10).execute();
  },

  canProcessItem: async (item) => {
    const { processed } = await db
      .selectFrom('item')
      .select('processed')
      .where('id', '=', item.id)
      .executeTakeFirstOrThrow();

    return processed === 'NO';
  },

  setItemStarted: async (item) => {
    await db.updateTable('item').set('processed', 'STARTED').where('id', '=', item.id).execute();
  },

  setItemProcessed: async (item) => {
    logger.verbose('Processed item %i', item.id);
    await db.updateTable('item').set('processed', 'V1').where('id', '=', item.id).execute();
  },

  onItemError: async (item, error) => {
    logger.error('Error processing item %i, %o', item.id, error);
    await db.updateTable('item').set('processed', 'FAIL').where('id', '=', item.id).execute();
  },
});

export default mediaProcessor;
