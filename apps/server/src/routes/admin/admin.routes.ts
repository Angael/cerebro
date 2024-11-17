import express from 'express';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import logger from '@/utils/log.js';
import { requireSession } from '@/middleware/requireSession.js';
import { AdminUsers_Endpoint, AdminUserPreview_Endpoint, UserMe } from '@cerebro/shared';
import {
  getAllUsers,
  getAllUsersSpaceUsage,
  getUserPreview,
  getUsersItemCounts,
} from '@/routes/admin/admin.service.js';
import z from 'zod';
import { limitsConfig } from '@/utils/limits.js';
import { honoFactory } from '../myHono';
import { HTTPException } from 'hono/http-exception';
import { zValidator } from '@hono/zod-validator';

const adminRoutes = honoFactory()
  .use('/admin', async (c, next) => {
    try {
      logger.verbose('Accessing admin route %s', c.req.url);
      const { user } = await requireSession(c);
      if (user.type !== 'ADMIN') {
        throw new HTTPException(403);
      } else {
        await next();
      }
    } catch (e) {
      return errorResponse(c, e);
    }
  })
  .get('/admin/all-users', async (c) => {
    try {
      const [users, usersUsage, itemCounts] = await Promise.all([
        getAllUsers(),
        getAllUsersSpaceUsage(),
        getUsersItemCounts(),
      ]);

      const usersWithUsage = users.map((user) => {
        const usedSpace = usersUsage.find((u) => u.user_id === user.id)?.total ?? 0;
        const maxSpace = limitsConfig[user.type];
        const itemCount = itemCounts.find((u) => u.user_id === user.id)?.itemCount ?? 0;
        return { ...user, usedSpace, maxSpace, itemCount };
      });

      return c.json(usersWithUsage satisfies AdminUsers_Endpoint);
    } catch (e) {
      return errorResponse(c, e);
    }
  })
  .get('/admin/user-preview', zValidator('query', z.object({ userId: z.string() })), async (c) => {
    const { userId } = c.req.valid('query');
    const users = await getUserPreview(userId);
    return c.json(users satisfies AdminUserPreview_Endpoint);
  });

export default adminRoutes;
