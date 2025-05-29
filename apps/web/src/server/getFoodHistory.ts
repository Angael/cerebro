'use server';
import { formatYYYYMMDD } from '@/utils/formatYYYYMMDD';
import { db } from '@cerebro/db';
import { startSpan } from '@sentry/nextjs';
import { sql } from 'kysely';
import { z } from 'zod';
import { requireUser } from './auth/getUser';
import { zFoodHistory } from './types/foodTypes';

export type FoodHistoryType = Awaited<ReturnType<typeof getFoodHistory>>;

const limit = 7;
export const getFoodHistory = async (userId: string): Promise<z.infer<typeof zFoodHistory>> =>
  startSpan({ name: 'SF_getFoodHistory', op: 'db' }, async (span) => {
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

    if (logsCountsDates.length === 0) {
      return [];
    }

    const yyyyMMdd = logsCountsDates.map((l) => formatYYYYMMDD(l.calendarDate));
    span.setAttribute('logsDatesLength', yyyyMMdd.length); // Set attribute on the span

    const logsOnThoseDays = await startSpan(
      { name: 'sqlGetLogsOnThoseDays', op: 'db' },
      async (_span) => {
        const result = await sql<any>`
select id, brands, product_name, food_product_id, amount, kcal, kcal_100g, DATE(date) as dayDate 
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
