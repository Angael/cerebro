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

const adminRoutes = express.Router({ mergeParams: true });
adminRoutes.use('/admin', express.json());
adminRoutes.use('/admin', async (req, res, next) => {
  try {
    logger.verbose('Accessing admin route %s', req.url);
    const { user } = await requireSession(req);
    if (user.type !== 'ADMIN') {
      res.sendStatus(401);
    } else {
      next();
    }
  } catch (e) {
    errorResponse(res, e);
  }
});

adminRoutes.get('/admin/all-users', async (req, res) => {
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

    res.json(usersWithUsage satisfies AdminUsers_Endpoint);
  } catch (e) {
    errorResponse(res, e);
  }
});

const userIdZod = z.object({ userId: z.string() });
adminRoutes.get('/admin/user-preview', async (req, res) => {
  try {
    const { userId } = userIdZod.parse(req.query);
    const users = await getUserPreview(userId);
    res.json(users satisfies AdminUserPreview_Endpoint);
  } catch (e) {
    errorResponse(res, e);
  }
});

export default adminRoutes;
