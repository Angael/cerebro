import fs from 'fs-extra';
import { extname, join } from 'path';
import { nanoid } from 'nanoid';
import { MAX_UPLOAD_SIZE, UPLOADS_DIR } from '@/utils/consts.js';
import { MyFile } from './upload/upload.type';
import { MyContext } from '../honoFactory';
import { HTTPException } from 'hono/http-exception';
import logger from '@/utils/log';

fs.mkdirs(UPLOADS_DIR);

export const handleUpload = async (c: MyContext): Promise<MyFile> => {
  const body = await c.req.parseBody();
  const file = body['file'];

  if (!file || typeof file === 'string') {
    logger.error('Somehow file was a string');
    throw new HTTPException(400, { message: 'No file provided' });
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    logger.error('File too big');
    throw new HTTPException(413, { message: 'File too big' });
  }

  const filename = nanoid() + extname(file.name);
  const filePath = join(UPLOADS_DIR, filename);
  await Bun.write(filePath, await file.arrayBuffer());

  return {
    path: filePath,
    originalname: file.name,
    filename,
    size: file.size,
    mimetype: file.type,
  };
};
