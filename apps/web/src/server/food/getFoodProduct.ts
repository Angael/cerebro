'use server';
import { z } from 'zod';
import { requireUser } from '@/server/auth/getUser';
import { db } from '@cerebro/db';
import { startSpan } from '@sentry/nextjs';
import { Logger } from '@/utils/logger';

const zFoodProductId = z.number().int().positive();

export const getFoodProduct = async (foodProductId: number) => {
  const user = await requireUser();

  const validatedFoodProductId = zFoodProductId.parse(foodProductId);

  const foodProduct = await startSpan({ name: 'getFoodProduct', op: 'db' }, () =>
    db
      .selectFrom('food_product')
      .selectAll()
      .where('id', '=', validatedFoodProductId)
      .where((eb) => eb.or([eb('user_id', '=', user.id), eb('user_id', 'is', null)]))
      .executeTakeFirst(),
  );

  if (!foodProduct) {
    const error = new Error('Food product not found');
    Logger.error('getFoodProduct', error);
    throw error;
  }

  return foodProduct;
};
