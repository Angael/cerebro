'use server';

import { db } from '@cerebro/db';
import { sql } from 'kysely';

export const getGoals = async (userId: string) => {
  return (
    db
      .selectFrom('food_goal')
      .select(['weight_kg', 'kcal', 'date'])
      .where('user_id', '=', userId)
      // First entry with date lower or equal to the date
      .where(sql<any>`DATE(date) <= ${new Date().toISOString().split('T')[0]!}`)
      .orderBy('date', 'desc')
      .executeTakeFirst()
  );
};
