'use server';
import { z } from 'zod';
import { requireUser } from './auth/getUser';
import { db } from '@cerebro/db';
import { startInactiveSpan, startSpan } from '@sentry/nextjs';

const zInsertedFoodLog = z.object({
  foodProductId: z.number(),
  amount: z.number(),
  date: z.string().datetime(),
});

export const postConsumedProduct = async (insertedFood: z.infer<typeof zInsertedFoodLog>) => {
  const user = await requireUser();
  const { amount, date, foodProductId } = zInsertedFoodLog.parse(insertedFood);

  const parentSpan = startInactiveSpan({ name: 'SF_postConsumedProduct', op: 'db' });

  const foodProduct = await startSpan(
    { name: 'selecting foodProduct', parentSpan, op: 'db' },
    async () =>
      await db
        .selectFrom('food_product')
        .selectAll()
        .where('id', '=', foodProductId)
        .executeTakeFirstOrThrow(),
  );

  const kcal = foodProduct.kcal_100g * (amount / 100);

  await startSpan({ name: 'inserting food log', parentSpan, op: 'db' }, () =>
    db
      .insertInto('food_log')
      .values([
        {
          user_id: user.id,
          food_product_id: foodProduct.id,
          barcode: foodProduct.barcode,
          kcal,
          kcal_100g: foodProduct.kcal_100g,
          product_name: foodProduct.product_name,
          brands: foodProduct.brands,
          amount,
          date: new Date(date),
        },
      ])
      .execute(),
  );

  return null;
};
