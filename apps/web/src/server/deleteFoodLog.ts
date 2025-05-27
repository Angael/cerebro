'use server';
import { z } from 'zod';
import { requireUser } from './auth/getUser';
import { db } from '@cerebro/db';
import { startSpan } from '@sentry/nextjs';

const zFoodId = z.number().int();

export const deleteFoodLog = async (foodId: number) => {
  const user = await requireUser();

  const foodLogId = zFoodId.parse(foodId);

  await startSpan({ name: 'SF_deleteFoodLog', op: 'db' }, () =>
    db.deleteFrom('food_log').where('user_id', '=', user.id).where('id', '=', foodLogId).execute(),
  );

  return null;
};
