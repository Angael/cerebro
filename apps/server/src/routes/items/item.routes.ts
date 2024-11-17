import { honoFactory } from '../myHono.js';
import { bodyLimit } from 'hono/body-limit';
import { cache } from 'hono/cache';
import { QueryItems } from '@cerebro/shared';
import z from 'zod';

import { usedSpaceCache } from '@/cache/userCache.js';
import { isPremium } from '@/middleware/isPremium.js';
import { optionalSession } from '@/middleware/optionalSession.js';
import { requireSession } from '@/middleware/requireSession.js';
import { doesUserHaveSpaceLeftForFile } from '@/routes/user/user.service.js';
import { betterUnlink } from '@/utils/betterUnlink.js';
import { MAX_UPLOAD_SIZE } from '@/utils/consts.js';
import { env } from '@/utils/env.js';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import logger from '@/utils/log.js';
import { zValidator } from '@hono/zod-validator';
import invariant from 'tiny-invariant';
import {
  downloadFromLinkService,
  getStatsFromLink,
} from './download-from-link/downloadFromLink.service.js';
import { deleteItem, getItem, getItems } from './item.service.js';
import { uploadFileForUser } from './upload/upload.service.js';
import { handleUpload } from './handleUpload.js';
import { HTTPException } from 'hono/http-exception';

const itemRoutes = honoFactory()
  .get(
    '/items',
    zValidator(
      'query',
      z.object({
        limit: z.coerce.number().min(1).max(100),
        page: z.coerce.number().min(0).max(Number.MAX_SAFE_INTEGER),
        author: z.enum(['all', 'my', 'other']),
      }),
    ),
    async (c) => {
      const { user } = await optionalSession(c);
      try {
        const { limit, page, author } = c.req.valid('query');

        const responseJson = await getItems(limit, page, user?.id ?? undefined, author);

        logger.info('Listing items %o', { userId: user?.id, page, limit });
        return c.json(responseJson satisfies QueryItems);
      } catch (e) {
        // TODO: is this still necessary? Hono should probably catch errors itself
        logger.error('Failed to list items for user: %s', user?.id);
        return errorResponse(c, e);
      }
    },
  )
  .get('/items/item/:id', async (c) => {
    const { user } = await optionalSession(c);

    const id = Number(c.req.param('id'));
    const item = await getItem(id, user?.id ?? undefined);

    logger.info('Got item %o', { userId: user?.id, id });
    return c.json(item);
  })
  .post(
    '/items/upload/file',
    bodyLimit({
      maxSize: MAX_UPLOAD_SIZE,
      onError: (c) => c.text('File too big', 413),
    }),
    isPremium,
    async (c) => {
      const { user } = await requireSession(c);
      const file = await handleUpload(c);

      try {
        if (env.MOCK_UPLOADS) {
          await new Promise((resolve) => setTimeout(resolve, 200));
          betterUnlink(file.path);
          c.body('', 200);
          return;
        }

        if (!(await doesUserHaveSpaceLeftForFile(user.id, file))) {
          throw new HTTPException(413, { message: 'Not enough space left' });
        }

        await uploadFileForUser({ file, userId: user.id });

        logger.info('Uploaded file %o', { userId: user.id, file });
        return c.body('', 200);
      } catch (e) {
        logger.error('Failed to upload file for user: %s', user!.id);
        if (file) {
          betterUnlink(file.path);
        }

        throw e;
      }
    },
  )
  .post(
    '/items/upload/file-from-link',
    isPremium,
    zValidator(
      'json',
      z.object({
        link: z.string().url().trim(),
        format: z.string().optional(),
      }),
    ),
    async (c) => {
      const { user } = await requireSession(c);
      try {
        const { link, format } = c.req.valid('json');

        if (env.MOCK_UPLOADS) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return c.body('ok', 200);
        }

        const file = await downloadFromLinkService(link, user.id, format);

        try {
          await uploadFileForUser({ file, userId: user.id });

          return c.body('ok', 200);
        } catch (e) {
          logger.error(e);
          throw e;
        } finally {
          logger.info('Uploaded file from link %o', { userId: user.id, link });
          await betterUnlink(file.path);
        }
      } catch (e) {
        logger.error('Failed to upload file from link for user: %s', user!.id);
        return errorResponse(c, e);
      }
    },
  )
  .get(
    '/items/upload/file-from-link',
    isPremium,
    cache({
      cacheName: 'file-from-link',
      cacheControl: 'max-age=60',
    }),
    zValidator('query', z.object({ link: z.string().url().trim() })),
    async (c) => {
      const { user } = await optionalSession(c);
      invariant(user, 'User not found');

      try {
        const { link } = c.req.valid('query');
        logger.verbose('Stats for link %s', link);

        const stats = await getStatsFromLink(link);

        return c.json(stats);
      } catch (e) {
        logger.error('Failed to get stats from link for user: %s', user.id);
        return errorResponse(c, e);
      }
    },
  )
  .delete('/items/item/:id', async (c) => {
    const id = Number(c.req.param('id'));
    const { user } = await requireSession(c);

    try {
      await deleteItem(id, user);

      usedSpaceCache.del(user.id);
      return c.body('', 200);
    } catch (e) {
      logger.error('Failed to delete item for user: %s', user.id);
      return errorResponse(c, e);
    }
  });

export default itemRoutes;
