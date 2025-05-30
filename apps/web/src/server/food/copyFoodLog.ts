'use server';
import { z } from 'zod';
import { requireUser } from '@/server/auth/getUser';
import { db } from '@cerebro/db';
import { startInactiveSpan, startSpan } from '@sentry/nextjs';

const zFoodLog = z.object({
  foodLogId: z.number(),
  date: z.string().date(),
});

export const copyFoodLog = async (foodLogData: z.infer<typeof zFoodLog>) => {
  const user = await requireUser();
  const { date, foodLogId } = zFoodLog.parse(foodLogData);

  const parentSpan = startInactiveSpan({ name: 'SF_copyFoodLog', op: 'db' });

  const foodLog = await startSpan({ name: 'selecting copied food log', parentSpan, op: 'db' }, () =>
    db
      .selectFrom('food_log')
      .selectAll()
      .where('id', '=', foodLogId)
      .where('user_id', '=', user.id)
      .executeTakeFirstOrThrow(),
  );

  // Exclude the id and date from the copied food log
  const { id: _1, date: _2, ...restColumns } = foodLog;

  await startSpan({ name: 'pasting food log', parentSpan, op: 'db' }, () =>
    db
      .insertInto('food_log')
      .values({ ...restColumns, date: new Date(date) })
      .execute(),
  );

  return null;
};
