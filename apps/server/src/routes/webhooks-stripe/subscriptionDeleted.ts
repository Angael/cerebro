import Stripe from 'stripe';
import z from 'zod';
import { db } from '@cerebro/db';
import invariant from 'tiny-invariant';

const sessionDeletedObjectZod = z.object({
  object: z.literal('subscription'),
  id: z.string(),
});

export const subscriptionDeleted = async (event: Stripe.Event) => {
  invariant(event.type === 'customer.subscription.deleted', 'Invalid event type');
  const { id } = sessionDeletedObjectZod.parse(event.data.object);

  await db
    .updateTable('stripe_customer')
    .set({ active_plan: null, subscription_id: null })
    .where('subscription_id', '=', id)
    .execute();

  const { user_id } = await db
    .selectFrom('stripe_customer')
    .select('user_id')
    .where('subscription_id', '=', id)
    .executeTakeFirstOrThrow();

  await db.updateTable('user').set({ type: 'FREE' }).where('id', '=', user_id).execute();
};
