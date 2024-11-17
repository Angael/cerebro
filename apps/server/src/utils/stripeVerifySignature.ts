import { stripe } from '@/my-stripe.js';
import logger from '@/utils/log.js';
import { env } from '@/utils/env.js';
import { MyContext } from '@/routes/myHono';
import { HTTPException } from 'hono/http-exception';

export const stripeVerifySignature = async (c: MyContext) => {
  const signature = c.req.header('stripe-signature');
  const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

  if (!signature) {
    throw new HTTPException(400, { message: 'Signature missing' });
  }

  try {
    const body = await c.req.text();
    return stripe.webhooks.constructEvent(body, signature as any, endpointSecret);
  } catch (err) {
    logger.error('Stripe signature verification failed! Someone hacking?');
    throw new HTTPException(400, { message: 'Stripe signature verification failed' });
  }
};
