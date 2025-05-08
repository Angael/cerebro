'use server';
import { z } from 'zod';
import { requireUser } from './getUser';
import { db } from '@cerebro/db';

const zFoodId = z.number().int();

export const deleteFoodLog = async (foodId: number) => {
  const user = await requireUser();
  const foodLogId = zFoodId.parse(foodId);

  await db
    .deleteFrom('food_log')
    .where('user_id', '=', user.id)
    .where('id', '=', foodLogId)
    .execute();

  return null;
};
