'use server';
import { z } from 'zod';
import { requireUser } from './auth/getUser';
import { db } from '@cerebro/db';
import { startInactiveSpan, startSpan } from '@sentry/nextjs';

const zFoodLog = z.object({
  foodLogId: z.number(),
  amount: z.number().positive(),
  kcal_100g: z.number().positive(),
  date: z.string().datetime(),
});

export const editFoodLog = async (foodLogData: z.infer<typeof zFoodLog>) => {
  const user = await requireUser();
  const { amount, kcal_100g, date, foodLogId } = zFoodLog.parse(foodLogData);

  const parentSpan = startInactiveSpan({ name: 'SF_editFoodLog', op: 'db' });

  const kcal = kcal_100g * (amount / 100);

  await startSpan({ name: 'editing food log', parentSpan, op: 'db' }, () =>
    db
      .updateTable('food_log')
      .set({
        kcal,
        kcal_100g,
        amount,
        date: new Date(date),
      })
      .where('id', '=', foodLogId)
      .where('user_id', '=', user.id)
      .execute(),
  );

  return null;
};
