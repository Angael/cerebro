import { stripeVerifySignature } from '@/utils/stripeVerifySignature.js';
import logger from '@/utils/log.js';
import { checkoutCompleted } from '@/routes/webhooks-stripe/checkoutCompleted.js';
import Stripe from 'stripe';
import { subscriptionDeleted } from '@/routes/webhooks-stripe/subscriptionDeleted.js';
import { subscriptionUpdated } from '@/routes/webhooks-stripe/subscriptionUpdated.js';
import { honoFactory } from '../honoFactory';
import { HTTPException } from 'hono/http-exception';

const eventHandlers: Partial<Record<Stripe.Event.Type, (event: Stripe.Event) => Promise<void>>> = {
  'checkout.session.completed': checkoutCompleted,
  'customer.subscription.updated': subscriptionUpdated,
  'customer.subscription.deleted': subscriptionDeleted,
};

const stripeRoutes = honoFactory().post('/webhooks/stripe', async (c) => {
  const event = await stripeVerifySignature(c);

  const handler = eventHandlers[event.type];
  if (handler) {
    try {
      await handler(event);
    } catch (e: any) {
      logger.error('Webhook error: %s: %s', event.type, e?.message);
      throw new HTTPException(500, { message: 'Webhook handler error' });
    }
    logger.info('Webhook: %s', event.type);
    return c.text('ok');
  }

  logger.error('Webhook 404: %s', event.type);
  throw new HTTPException(404, { message: 'Webhook not handled' });
});

export default stripeRoutes;
