'use server';
import { db } from '@cerebro/db';
import { requireUser } from '@/server/auth/getUser';
import { startSpan } from '@sentry/nextjs';

export const fetchMyFoodProducts = async () => {
  const user = await requireUser();

  return startSpan({ name: 'SF_fetchMyFoodProducts' }, () =>
    db
      .selectFrom('food_product')
      .selectAll()
      .where((eb) => eb.or([eb('user_id', '=', user.id), eb('user_id', 'is', null)]))
      .execute(),
  );
};
