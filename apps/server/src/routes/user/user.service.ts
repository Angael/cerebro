import { limitsConfig } from '@/utils/limits.js';
import { usedSpaceCache, userTypeCache } from '@/cache/userCache.js';
import { db, UserType } from '@cerebro/db';
import { sql } from 'kysely';

import { MyFile } from '../items/upload/upload.type.js';
import { HttpError } from '@/utils/errors/HttpError.js';
import { GetUploadLimits } from '@cerebro/shared';
import logger from '@/utils/log.js';
import { stripe } from '@/stripe.js';
import { checkoutMetadataZod } from '@/models/StripeCheckout.js';
import { User } from 'lucia';
import { env } from '@/utils/env.js';

export const getSpaceUsedByUser = async (user_id: string): Promise<number> => {
  let used: number;
  if (usedSpaceCache.has(user_id)) {
    used = usedSpaceCache.get(user_id) as number;
  } else {
    const { rows } = await sql<{ total: string }>`SELECT SUM(size) AS total
  FROM (
    SELECT size FROM image WHERE image.item_id IN (SELECT id FROM item WHERE item.user_id = ${user_id})
    UNION ALL
    SELECT size FROM video WHERE video.item_id IN (SELECT id FROM item WHERE item.user_id = ${user_id})
    UNION ALL
    SELECT size FROM thumbnail WHERE thumbnail.item_id IN (SELECT id FROM item WHERE item.user_id = ${user_id})
  ) AS combined_sizes;`.execute(db);

    used = Math.round(Number(rows[0]?.total || 0));

    usedSpaceCache.set(user_id, used);
  }

  return used;
};

export async function getUserType(uid: string): Promise<UserType> {
  if (userTypeCache.has(uid)) {
    return userTypeCache.get(uid) as UserType;
  } else {
    try {
      const { type } = await db
        .selectFrom('user')
        .select('type')
        .where('id', '=', uid)
        .executeTakeFirstOrThrow();

      userTypeCache.set(uid, type);
      return type;
    } catch (e) {
      logger.error('Failed to get userType for uid: %n, %o', uid, e);
      throw new HttpError(404);
    }
  }
}

export async function getLimitsForUser(userId: string): Promise<GetUploadLimits> {
  const type = await getUserType(userId);
  const max = limitsConfig[type];
  const used: number = await getSpaceUsedByUser(userId);

  return { type, bytes: { used, max } };
}

export async function doesUserHaveSpaceLeftForFile(userId: string, file: MyFile) {
  const limits = await getLimitsForUser(userId);
  const spaceLeft = limits.bytes.max - limits.bytes.used;
  return spaceLeft - file.size > 0;
}

export async function getStripeCustomer(userId: string) {
  const stripeCustomer = await db
    .selectFrom('stripe_customer')
    .select(['stripe_customer_id', 'active_plan', 'plan_expiration'])
    .where('user_id', '=', userId)
    .executeTakeFirst();

  if (!stripeCustomer) {
    throw new HttpError(404, 'User is not a stripe customer yet');
  }

  const { active_plan, plan_expiration } = stripeCustomer;

  return {
    customerId: stripeCustomer.stripe_customer_id,
    activePlan: active_plan,
    expiresAt: plan_expiration?.toISOString() ?? null,
  };
}

export async function createSessionWithAccessPlan(user: User): Promise<{ url: string }> {
  const stripeCustomer = await getStripeCustomer(user.id).catch(() => null);

  const session = await stripe.checkout.sessions.create({
    metadata: checkoutMetadataZod.parse({
      user_id: user.id,
      plan: 'ACCESS_PLAN',
    }) as Record<string, string | number>,
    mode: 'subscription',
    customer: stripeCustomer?.customerId,
    customer_email: user.email,
    success_url: `${env.CORS_URL}/account`,
    cancel_url: `${env.CORS_URL}/account`,
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_ACCESS_PRICE_ID,
        quantity: 1,
      },
    ],
  });

  return { url: session.url as string };
}
