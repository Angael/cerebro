import z from 'zod';
import { StripeCustomer } from '@cerebro/db';

const acceptedPlans = ['ACCESS_PLAN', 'VIP'] as const satisfies Array<
  StripeCustomer['active_plan']
>;

export const checkoutMetadataZod = z.object({
  user_id: z.string(),
  plan: z.enum(acceptedPlans).nullable(),
});
