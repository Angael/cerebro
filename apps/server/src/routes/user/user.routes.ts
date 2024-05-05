import express from 'express';
import {
  createSessionWithAccessPlan,
  getLimitsForUser,
  getStripeCustomer,
} from './user.service.js';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import logger from '@/utils/log.js';
import { requireSession } from '@/middleware/requireSession.js';
import { UserMe, UserPlan_Endpoint } from '@cerebro/shared';
import { stripe } from '@/stripe.js';
import { HttpError } from '@/utils/errors/HttpError.js';

const userRoutes = express.Router({ mergeParams: true });
userRoutes.use('/user', express.json());

userRoutes.get('/user/me', async (req, res) => {
  try {
    const { user, session } = await requireSession(req);
    res.json({
      id: user.id,
      email: user.email,
      type: user.type,
      sessionExpiresAt: session.expiresAt.toISOString(),
    } satisfies UserMe);
  } catch (e) {
    logger.verbose('Not logged in');

    res.json(null satisfies UserMe);
  }
});

userRoutes.get('/user/limits', async (req, res) => {
  try {
    const { user } = await requireSession(req);
    try {
      const uploadLimits = await getLimitsForUser(user.id);
      res.json(uploadLimits);
    } catch (e) {
      logger.error('Failed to list limits for user: %n', user.id);
      errorResponse(res, e);
    }
  } catch (e) {
    res.sendStatus(401);
  }
});

userRoutes.get('/user/plan', async (req, res) => {
  try {
    const { user } = await requireSession(req);

    try {
      const userPlan = await getStripeCustomer(user.id);
      res.json(userPlan satisfies UserPlan_Endpoint);
    } catch (e) {
      if (e instanceof HttpError && e.status === 404) {
        res.json(null satisfies UserPlan_Endpoint);
      } else {
        throw e;
      }
    }
  } catch (e) {
    logger.error('Failed to get user plan');
    errorResponse(res, e);
  }
});

userRoutes.post('/user/subscribe', async (req, res) => {
  try {
    const { user } = await requireSession(req);

    res.json(createSessionWithAccessPlan(user));
  } catch (e) {
    errorResponse(res, e);
  }
});

userRoutes.get('/user/billing', async (req, res) => {
  try {
    const { user } = await requireSession(req);
    const stripeCustomer = await getStripeCustomer(user.id);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomer.customerId,
      return_url: req.headers.origin,
    });

    res.json({ url: portalSession.url });
  } catch (e) {
    errorResponse(res, e);
  }
});

export default userRoutes;
