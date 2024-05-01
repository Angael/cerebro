import type { Request } from 'express';
import { stripe } from '@/stripe.js';
import logger from '@/utils/log.js';
import { HttpError } from '@/utils/errors/HttpError.js';

export const stripeVerifySignature = async (req: Request) => {
  const signature = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET!;
  try {
    return stripe.webhooks.constructEvent(req.body, signature as any, endpointSecret);
  } catch (err) {
    logger.error('Stripe signature verification failed! Someone hacking?');
    throw new HttpError(400, 'Stripe signature verification failed!');
  }
};
