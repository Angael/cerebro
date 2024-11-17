import { requireSession } from '@/middleware/requireSession.js';
import { stripe } from '@/my-stripe.js';
import { honoFactory } from '@/routes/myHono.js';
import { env } from '@/utils/env.js';
import logger from '@/utils/log.js';
import { UserMe, UserPlan_Endpoint } from '@cerebro/shared';
import { HTTPException } from 'hono/http-exception';
import { createAccessPlanCheckout, getLimitsForUser, getStripeCustomer } from './user.service.js';

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
    const { user } = await requireSession(c);
    try {
      const uploadLimits = await getLimitsForUser(user.id);
      return c.json(uploadLimits);
    } catch (e) {
      logger.error('Failed to list limits for user: %s', user.id);
      throw e;
    }
  })
  .get('/user/plan', async (c) => {
    try {
      const { user } = await requireSession(c);

      const userPlan = await getStripeCustomer(user.id);
      return c.json(userPlan satisfies UserPlan_Endpoint);
    } catch (e) {
      if (e instanceof HTTPException && e.status === 404) {
        return c.json(null satisfies UserPlan_Endpoint);
      }

      logger.error('Failed to get user plan');
      throw e;
    }
  })
  .post('/user/subscribe', async (c) => {
    const { user } = await requireSession(c);

    return c.json(await createAccessPlanCheckout(user));
  })
  .get('/user/billing', async (c) => {
    const { user } = await requireSession(c);
    const stripeCustomer = await getStripeCustomer(user.id);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomer.customerId,
      return_url: c.req.header('origin') ?? env.CORS_URL,
    });

    return c.json({ url: portalSession.url });
  });

export default userRoutes;
