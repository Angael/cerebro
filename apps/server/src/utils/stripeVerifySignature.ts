import { stripe } from '@/stripe.js';
import logger from '@/utils/log.js';
import { HttpError } from '@/utils/errors/HttpError.js';

export const stripeVerifySignature = async (req: any) => {
  const signature = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET!;
  try {
    const event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
    return event;
  } catch (err) {
    logger.error('Stripe signature verification failed! Someone hacking?');
    throw new HttpError(400, 'Stripe signature verification failed!');
  }
};
