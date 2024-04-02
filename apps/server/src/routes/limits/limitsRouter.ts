import express from 'express';
import { getLimitsForUser } from './limits-service.js';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import logger from '@/utils/log.js';
import { requireSession } from '@/middleware/requireSession.js';

const limitsRouter = express.Router({ mergeParams: true });

limitsRouter.get('/account/limits', async (req, res) => {
  const { user } = await requireSession(req);
  try {
    res.json(await getLimitsForUser(user.id));
  } catch (e) {
    logger.error('Failed to list limits for user: %n', user.id);
    errorResponse(res, e);
  }
});

export default limitsRouter;
