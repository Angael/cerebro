import { db, FoodLog, FoodProduct } from '@cerebro/db';
import { format } from 'date-fns';
import { sql } from 'kysely';
import { z } from 'zod';
import { InsertedFoodLog, zFoodHistory } from './food.model';

const zIsDate = z.string().date();

export async function getFoodLogsInDay(userId: string, date?: string): Promise<FoodLog[]> {
  let dateOrToday = date ? zIsDate.parse(date) : new Date().toISOString().split('T')[0];

  return await db
    .selectFrom('food_log')
    .selectAll()
    .where('user_id', '=', userId)
    .where(sql<any>`DATE(date) = ${dateOrToday}`)
    .execute();
}

export async function getDaysFoods(userId: string, limit: number = 3) {
  const logsCountsDates = await sql<{
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

  const yyyyMMdd = logsCountsDates.map((l) => format(l.calendarDate, 'yyyy-MM-dd'));

  const logsOnThoseDays = await sql<any>`
select id, brands, product_name,amount, kcal, kcal_100g, DATE(date) as dayDate 
  from food_log 
  where user_id = ${userId} 
  and DATE(date) IN (${yyyyMMdd})`.execute(db);

  return zFoodHistory.parse(logsOnThoseDays.rows);
}

export async function getMyProducts(userId: string): Promise<FoodProduct[]> {
  return await db.selectFrom('food_product').selectAll().where('user_id', '=', userId).execute();
}

// TODO: expand to support also custom foods
export const insertFoodLog = async (userId: string, payload: InsertedFoodLog) => {
  const { foodProductId, amount, date } = payload;

  const foodProduct = await db
    .selectFrom('food_product')
    .selectAll()
    .where('id', '=', foodProductId)
    .executeTakeFirstOrThrow();

  const kcal = foodProduct.kcal_100g * (amount / 100);

  return await db
    .insertInto('food_log')
    .values([
      {
        user_id: userId,
        barcode: foodProduct.barcode,
        kcal,
        kcal_100g: foodProduct.kcal_100g,
        product_name: foodProduct.product_name,
        brands: foodProduct.brands,
        amount,
        date: new Date(date),
      },
    ])
    .execute();
};

export const deleteFoodLog = async (userId: string, foodId: number) => {
  return await db
    .deleteFrom('food_log')
    .where('user_id', '=', userId)
    .where('id', '=', foodId)
    .execute();
};
