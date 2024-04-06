import express from 'express';
import { getLimitsForUser } from './user.service.js';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import logger from '@/utils/log.js';
import { requireSession } from '@/middleware/requireSession.js';
import { UserMe } from '@cerebro/shared';

const userRoutes = express.Router({ mergeParams: true });

userRoutes.get('/user/me', async (req, res) => {
  try {
    const { user, session } = await requireSession(req);
    res.json({
      id: user.id,
      email: user.email,
      type: user.type,
      sessionExpiresAt: session.expiresAt,
    } satisfies UserMe);
  } catch (e) {
    logger.verbose('Not logged in');
    errorResponse(res, e);
  }
});

userRoutes.get('/user/limits', async (req, res) => {
  const { user } = await requireSession(req);
  try {
    res.json(await getLimitsForUser(user.id));
  } catch (e) {
    logger.error('Failed to list limits for user: %n', user.id);
    errorResponse(res, e);
  }
});

export default userRoutes;
