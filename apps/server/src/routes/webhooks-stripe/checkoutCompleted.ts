import Stripe from 'stripe';
import z from 'zod';
import { db } from '@cerebro/db';
import { nanoid } from 'nanoid';
import invariant from 'tiny-invariant';
import { checkoutMetadataZod } from '@/models/StripeCheckout.js';

const checkoutSessionZod = z.object({
  subscription: z.string(),
  customer: z.string(),
  metadata: checkoutMetadataZod,
});

export const checkoutCompleted = async (event: Stripe.Event) => {
  invariant(event.type === 'checkout.session.completed', 'Invalid event type');
  const { customer, metadata, subscription } = checkoutSessionZod.parse(event.data.object);

  const existingCustomer = await db
    .selectFrom('stripe_customer')
    .select('id')
    .where('user_id', '=', metadata.user_id)
    .executeTakeFirst();

  if (existingCustomer) {
    await db
      .updateTable('stripe_customer')
      .set({
        subscription_id: subscription,
        stripe_customer_id: customer,
        active_plan: metadata.plan,
        plan_expiration: null,
      })
      .where('user_id', '=', metadata.user_id)
      .execute();
  } else {
    await db
      .insertInto('stripe_customer')
      .values({
        id: nanoid(),
        user_id: metadata.user_id,
        subscription_id: subscription,
        stripe_customer_id: customer,
        active_plan: metadata.plan,
        plan_expiration: null,
      })
      .execute();
  }

  await db
    .updateTable('user')
    .set({ type: 'PREMIUM' })
    .where('id', '=', metadata.user_id)
    .execute();
};
