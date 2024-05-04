import Stripe from 'stripe';
import z from 'zod';
import { db } from '@cerebro/db';
import invariant from 'tiny-invariant';

const updateObjectZod = z.object({
  subscription: z.object({ id: z.string() }),
  cancel_at: z.number(),
});

export const subscriptionUpdated = async (event: Stripe.Event) => {
  invariant(event.type === 'customer.subscription.updated', 'Invalid event type');
  const { subscription, cancel_at } = updateObjectZod.parse(event.data.object);

  const plan_expires = new Date(cancel_at * 1000);

  await db
    .updateTable('stripe_customer')
    .set({ plan_expiration: plan_expires })
    .where('subscription_id', '=', subscription.id)
    .execute();
};
