import express from 'express';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import { stripeVerifySignature } from '@/utils/stripeVerifySignature.js';
import logger from '@/utils/log.js';
import { HttpError } from '@/utils/errors/HttpError.js';
import { db } from '@cerebro/db';
import { nanoid } from 'nanoid';
import z from 'zod';
import bodyParser from 'body-parser';

const stripeRoutes = express.Router({ mergeParams: true });

// TODO split separate webhooks into separate files
const checkoutSessionZod = z.object({
  subscription: z.string(),
  customer: z.string(),
  metadata: z.object({
    user_id: z.string(),
    plan: z.enum(['BETA_TIER', 'VIP']),
  }),
});

stripeRoutes.post(
  '/webhooks/stripe',
  bodyParser.raw({ type: 'application/json' }),
  async (req, res) => {
    try {
      const event = await stripeVerifySignature(req);

      if (event.type === 'checkout.session.completed') {
        // Handle checkout session completed
        const eventData = checkoutSessionZod.parse(event.data.object);

        await db
          .insertInto('stripe_customer')
          .values({
            id: nanoid(),
            user_id: eventData.metadata.user_id,
            subscription_id: eventData.subscription,
            stripe_customer_id: eventData.customer,
            active_plan: eventData.metadata.plan,
            plan_expiration: null,
          })
          .execute();

        res.status(200).send();
        logger.info('Handled webhook checkout.session.completed');
        return;
      }

      logger.info('Webhook not handled: %s', event.type);
      throw new HttpError(404, 'Webhook not handled');
    } catch (e) {
      errorResponse(res, e);
    }
  },
);

export default stripeRoutes;
