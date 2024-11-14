import express, { Request, Router } from 'express';
import multer from 'multer';
import z from 'zod';
import { QueryItems } from '@cerebro/shared';

import { deleteItem, getItems, getItem } from './item.service.js';
import { multerOptions } from './multerConfig.js';
import { MAX_UPLOAD_SIZE } from '@/utils/consts.js';
import { uploadFileForUser } from './upload/upload.service.js';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import { useCache } from '@/middleware/expressCache.js';
import { usedSpaceCache } from '@/cache/userCache.js';
import { doesUserHaveSpaceLeftForFile } from '@/routes/user/user.service.js';
import { HttpError } from '@/utils/errors/HttpError.js';
import { betterUnlink } from '@/utils/betterUnlink.js';
import logger from '@/utils/log.js';
import {
  downloadFromLinkService,
  getStatsFromLink,
} from './download-from-link/downloadFromLink.service.js';
import { isPremium } from '@/middleware/isPremium.js';
import { env } from '@/utils/env.js';
import { optionalSession } from '@/middleware/optionalSession.js';
import invariant from 'tiny-invariant';
import { requireSession } from '@/middleware/requireSession.js';

const itemRoutes = express.Router({ mergeParams: true });
itemRoutes.use('/items', express.json());

const parseItemsQueryZod = z.object({
  limit: z.coerce.number().min(1).max(100),
  page: z.coerce.number().min(0).max(Number.MAX_SAFE_INTEGER),
  author: z.enum(['all', 'my', 'other']),
});

itemRoutes.get('/items', async (req, res) => {
  const { user } = await optionalSession(req);
  try {
    const { limit, page, author } = parseItemsQueryZod.parse(req.query);

    const responseJson = await getItems(limit, page, user?.id ?? undefined, author);

    logger.info('Listing items %o', { userId: user?.id, page, limit });
    res.json(responseJson satisfies QueryItems);
  } catch (e) {
    logger.error('Failed to list items for user: %s', user?.id);
    errorResponse(res, e);
  }
});

itemRoutes.get('/items/item/:id', async (req: Request, res) => {
  const { user } = await optionalSession(req);
  try {
    const id = Number(req.params.id);
    const item = await getItem(id, user?.id ?? undefined);

    logger.info('Getting item %o', { userId: user?.id, id });
    res.json(item);
  } catch (e) {
    logger.error('Failed to get item for user: %s', user?.id);
    errorResponse(res, e);
  }
});

const uploadMiddleware = multer(multerOptions);
itemRoutes.post(
  '/items/upload/file',
  isPremium,
  uploadMiddleware.single('file') as any, // deal with it later, maybe version mismatch. Monkey-patching request type breaks stuff
  async (req, res) => {
    const { user } = await requireSession(req);
    invariant(user, 'User not found');
    const file = req.file;

    try {
      console.log(0);
      if (!file) {
        console.log(1);
        res.sendStatus(400);
        return;
      }

      if (file.size > MAX_UPLOAD_SIZE) {
        console.log(2);
        throw new Error('File too big');
      }

      if (env.MOCK_UPLOADS) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        betterUnlink(file.path);
        res.status(200).send();
        return;
      }

      if (!(await doesUserHaveSpaceLeftForFile(user.id, file))) {
        throw new HttpError(413);
      }

      console.log('start uploadFileForUser');
      await uploadFileForUser({ file, userId: user.id });
      console.log('end uploadFileForUser');

      logger.info('Uploaded file %o', { userId: user.id, file });
      res.status(200).send();
    } catch (e) {
      logger.error('Failed to upload file for user: %s', user!.id);
      if (file) {
        betterUnlink(file?.path);
      }
      errorResponse(res, e);
    }
  },
);

const fileFromLinkZod = z.object({
  link: z.string().url().trim(),
  format: z.string().optional(),
});

itemRoutes.post('/items/upload/file-from-link', isPremium, async (req, res) => {
  const { user } = await requireSession(req);
  try {
    const { link, format } = fileFromLinkZod.parse(req.body);

    if (env.MOCK_UPLOADS) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      res.status(200).send();
      return;
    }

    const file = await downloadFromLinkService(link, user.id, format);

    try {
      await uploadFileForUser({ file, userId: user.id });

      res.status(200).send();
    } catch (e) {
      logger.error(e);
      throw e;
    } finally {
      logger.info('Uploaded file from link %o', { userId: user.id, link });
      await betterUnlink(file.path);
    }
  } catch (e) {
    logger.error('Failed to upload file from link for user: %s', user!.id);
    errorResponse(res, e);
  }
});

const fileFromLinkParamsZod = z.object({
  link: z.string().url().trim(),
});

itemRoutes.get(
  '/items/upload/file-from-link',
  isPremium,
  useCache(60),
  async (req: Request, res) => {
    const { user } = await optionalSession(req);
    invariant(user, 'User not found');

    try {
      const { link } = fileFromLinkParamsZod.parse(req.query);
      logger.verbose('Stats for link %s', link);

      const stats = await getStatsFromLink(link);

      res.status(200).json(stats);
    } catch (e) {
      logger.error('Failed to get stats from link for user: %s', user.id);
      errorResponse(res, e);
    }
  },
);

itemRoutes.delete('/items/item/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { user } = await requireSession(req);

  try {
    await deleteItem(id, user);

    usedSpaceCache.del(user.id);
    res.status(200).send();
  } catch (e) {
    logger.error('Failed to delete item for user: %s', user.id);
    errorResponse(res, e);
  }
});

export default itemRoutes satisfies Router;
