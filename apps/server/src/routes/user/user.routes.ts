import { honoFactory } from '@/routes/myHono.js';
import { createAccessPlanCheckout, getLimitsForUser, getStripeCustomer } from './user.service.js';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import logger from '@/utils/log.js';
import { requireSession } from '@/middleware/requireSession.js';
import { UserMe, UserPlan_Endpoint } from '@cerebro/shared';
import { stripe } from '@/my-stripe.js';
import { HttpError } from '@/utils/errors/HttpError.js';
import { env } from '@/utils/env.js';

const userRoutes = honoFactory()
  .get('/user/me', async (c) => {
    try {
      const { user, session } = await requireSession(c);
      return c.json({
        id: user.id,
        email: user.email,
        type: user.type,
        sessionExpiresAt: session.expiresAt.toISOString(),
      } satisfies UserMe);
    } catch (e) {
      logger.verbose('Not logged in');

      return c.json(null satisfies UserMe);
    }
  })
  .get('/user/limits', async (c) => {
    try {
      const { user } = await requireSession(c);
      try {
        const uploadLimits = await getLimitsForUser(user.id);
        return c.json(uploadLimits);
      } catch (e) {
        logger.error('Failed to list limits for user: %n', user.id);
        return errorResponse(c, e);
      }
    } catch (e) {
      return c.body('', 401);
    }
  })
  .get('/user/plan', async (c) => {
    try {
      const { user } = await requireSession(c);

      try {
        const userPlan = await getStripeCustomer(user.id);
        return c.json(userPlan satisfies UserPlan_Endpoint);
      } catch (e) {
        if (e instanceof HttpError && e.status === 404) {
          return c.json(null satisfies UserPlan_Endpoint);
        } else {
          throw e;
        }
      }
    } catch (e) {
      logger.error('Failed to get user plan');
      return errorResponse(c, e);
    }
  })
  .post('/user/subscribe', async (c) => {
    try {
      const { user } = await requireSession(c);

      return c.json(await createAccessPlanCheckout(user));
    } catch (e) {
      return errorResponse(c, e);
    }
  })
  .get('/user/billing', async (c) => {
    try {
      const { user } = await requireSession(c);
      const stripeCustomer = await getStripeCustomer(user.id);

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: stripeCustomer.customerId,
        return_url: c.req.header('origin') ?? env.CORS_URL,
      });

      return c.json({ url: portalSession.url });
    } catch (e) {
      return errorResponse(c, e);
    }
  });

export default userRoutes;
