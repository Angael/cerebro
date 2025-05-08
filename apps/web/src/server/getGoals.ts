'use server';

import { db } from '@cerebro/db';
import { startSpan } from '@sentry/nextjs';
import { sql } from 'kysely';

export type GoalsType = Awaited<ReturnType<typeof getGoals>>;

export const getGoals = async (userId: string) =>
  startSpan({ name: 'SF_getGoals', op: 'db' }, () =>
    db
      .selectFrom('food_goal')
      .select(['weight_kg', 'kcal', 'date'])
      .where('user_id', '=', userId)
      // First entry with date lower or equal to the date
      .where(sql<any>`DATE(date) <= ${new Date().toISOString().split('T')[0]!}`)
      .orderBy('date', 'desc')
      .executeTakeFirst(),
  );
