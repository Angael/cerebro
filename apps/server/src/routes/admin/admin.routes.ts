import express from 'express';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import logger from '@/utils/log.js';
import { requireSession } from '@/middleware/requireSession.js';
import { AdminAllUsers, UserMe } from '@cerebro/shared';
import { getAllUsers } from '@/routes/admin/admin.service.js';

const adminRoutes = express.Router({ mergeParams: true });

adminRoutes.use(async (req, res, next) => {
  try {
    logger.info('Accessing admin route %s', req.url);
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
    const users = await getAllUsers();
    res.json(users satisfies AdminAllUsers);
  } catch (e) {
    errorResponse(res, e);
  }
});

export default adminRoutes;
