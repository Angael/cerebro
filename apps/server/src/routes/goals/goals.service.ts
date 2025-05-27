import { db } from '@cerebro/db';
import { sql } from 'kysely';
import { GoalsType } from './goals.model';

export const setCurrentGoals = async (userId: string, payload: GoalsType) => {
  const { kcal, weight_kg, date } = payload;

  // Delete previous goals for the same date
  return await db.transaction().execute(async (trx) => {
    await trx
      .deleteFrom('food_goal')
      .where('user_id', '=', userId)
      .where(sql<any>`DATE(date) = ${date}`)
      .execute();

    return await trx
      .insertInto('food_goal')
      .values([{ user_id: userId, kcal, weight_kg, date }])
      .execute();
  });
};
