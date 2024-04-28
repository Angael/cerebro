import express from 'express';
import { errorResponse } from '@/utils/errors/errorResponse.js';
import { stripeVerifySignature } from '@/utils/stripeVerifySignature.js';
import logger from '@/utils/log.js';
import { HttpError } from '@/utils/errors/HttpError.js';

const stripeRoutes = express.Router({ mergeParams: true });

stripeRoutes.post('/webhooks/stripe', async (req, res) => {
  try {
    const event = await stripeVerifySignature(req);

    if (event.type === 'checkout.session.completed') {
      // Handle checkout session completed
    }

    logger.info('Webhook not handled: %s', event.type);
    throw new HttpError(404, 'Webhook not handled');
  } catch (e) {
    errorResponse(res, e);
  }
});

export default stripeRoutes;
