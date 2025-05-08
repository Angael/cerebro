'use server';
import { db } from '@cerebro/db';
import { requireUser } from './getUser';

export const fetchMyFoodProducts = async () => {
  const user = await requireUser();

  return await db
    .selectFrom('food_product')
    .selectAll()
    .where((eb) => eb.or([eb('user_id', '=', user.id), eb('user_id', 'is', null)]))
    .execute();
};
