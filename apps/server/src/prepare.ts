import fs from 'fs-extra';
import {
  DOWNLOADS_DIR,
  OPTIMIZATION_DIR,
  TEMP_DIR,
  THUMBNAILS_DIR,
  UPLOADS_DIR,
} from './utils/consts.js';
import logger from '@/utils/log.js';

(async () => {
  await fs.emptyDir(TEMP_DIR).catch((e) => {});
  await Promise.all([
    fs.mkdir(UPLOADS_DIR, { recursive: true }),
    fs.mkdir(DOWNLOADS_DIR, { recursive: true }),
    fs.mkdir(THUMBNAILS_DIR, { recursive: true }),
    fs.mkdir(OPTIMIZATION_DIR, { recursive: true }),
  ]);

  logger.info('Prepared directories');
})();
