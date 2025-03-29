import { db } from '@cerebro/db';
import { sql } from 'kysely';
import { z } from 'zod';
import { GoalsType } from './goals.model';

const zIsDate = z.string().date();

export async function getGoals(userId: string, date?: string): Promise<GoalsType | null> {
  let dateOrToday = date ? zIsDate.parse(date) : new Date().toISOString().split('T')[0]!;

  const goals = await db
    .selectFrom('food_goal')
    .select(['weight_kg', 'kcal', 'date'])
    .where('user_id', '=', userId)
    // First entry with date lower or equal to the date
    .where(sql<any>`DATE(date) <= ${dateOrToday}`)
    .orderBy('date', 'desc')
    .executeTakeFirst();

  return goals
    ? {
        ...goals,
        date: goals?.date.toISOString().split('T')[0]!,
      }
    : null;
}

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
      .values([
        {
          user_id: userId,
          kcal,
          weight_kg,
          date: new Date(date),
        },
      ])
      .execute();
  });
};
