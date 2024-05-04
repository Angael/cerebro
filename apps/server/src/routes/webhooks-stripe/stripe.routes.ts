import express from 'express';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import { stripeVerifySignature } from '@/utils/stripeVerifySignature.js';
import logger from '@/utils/log.js';
import { HttpError } from '@/utils/errors/HttpError.js';
import bodyParser from 'body-parser';
import { checkoutCompleted } from '@/routes/webhooks-stripe/checkoutCompleted.js';
import Stripe from 'stripe';
import { subscriptionDeleted } from '@/routes/webhooks-stripe/subscriptionDeleted.js';
import { subscriptionUpdated } from '@/routes/webhooks-stripe/subscriptionUpdated.js';

const stripeRoutes = express.Router({ mergeParams: true });

const eventHandlers: Partial<Record<Stripe.Event.Type, (event: Stripe.Event) => Promise<void>>> = {
  'checkout.session.completed': checkoutCompleted,
  'customer.subscription.updated': subscriptionUpdated,
  'customer.subscription.deleted': subscriptionDeleted,
};

stripeRoutes.post(
  '/webhooks/stripe',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      const event = await stripeVerifySignature(req);

      const handler = eventHandlers[event.type];
      if (handler) {
        await handler(event);
        logger.info('Webhook: %s', event.type);
        res.status(200).send();
        return;
      }

      logger.error('Webhook 404: %s', event.type);
      throw new HttpError(404, 'Webhook not handled');
    } catch (e) {
      errorResponse(res, e);
    }
  },
);

export default stripeRoutes;
