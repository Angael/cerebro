'use server';
import { db } from '@cerebro/db';
import { sql } from 'kysely';
import { format } from 'date-fns';
import { z } from 'zod';
import { requireUser } from './getUser';
import { startSpan, getActiveSpan } from '@sentry/nextjs';

export type FoodHistoryType = Awaited<ReturnType<typeof getFoodHistory>>;

// Validate response, as query is not typed
const zFoodHistory = z.array(
  z.object({
    id: z.number(),
    brands: z.string().nullable(),
    product_name: z.string(),
    amount: z.number(),
    kcal: z.number(),
    kcal_100g: z.number(),
    dayDate: z.string().date(),
  }),
);

const limit = 7;
export const getFoodHistory = async (userId: string) =>
  startSpan({ name: 'SF_getFoodHistory' }, async (span) => {
    const currentSpan = getActiveSpan();

    if (currentSpan) {
      currentSpan.setAttribute('my_userId', userId); // Set attribute on the span
    }

    const logsCountsDates = await startSpan(
      { name: 'logsCountsDates', op: 'db' },
      async (_span) => {
        const result = await sql<{
          logs_count: number;
          calendarDate: Date;
        }>`SELECT COUNT(*) AS logs_count, DATE(date) AS calendarDate
      FROM food_log
      WHERE user_id = ${userId}
      GROUP BY calendarDate
      ORDER BY calendarDate DESC
      LIMIT ${limit}`
          .execute(db)
          .then((r) => r.rows);
        return result;
      },
    );

    const yyyyMMdd = logsCountsDates.map((l) => format(l.calendarDate, 'yyyy-MM-dd'));
    span.setAttribute('logsDatesLength', yyyyMMdd.length); // Set attribute on the span

    const logsOnThoseDays = await startSpan(
      { name: 'sqlGetLogsOnThoseDays', op: 'db' },
      async (_span) => {
        const result = await sql<any>`
select id, brands, product_name,amount, kcal, kcal_100g, DATE(date) as dayDate 
  from food_log 
  where user_id = ${userId} 
  and DATE(date) IN (${yyyyMMdd})`.execute(db);
        return result;
      },
    );

    return zFoodHistory.parse(logsOnThoseDays.rows);
  });

export const fetchFoodHistory = async () => {
  const user = await requireUser();

  return await getFoodHistory(user.id);
};
