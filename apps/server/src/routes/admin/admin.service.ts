import { db } from '@cerebro/db';
import { AdminUserPreview_Endpoint } from '@cerebro/shared';
import { getLimitsForUser } from '@/routes/user/user.service.js';
import { sql } from 'kysely';

export const getAllUsers = async () => {
  return await db.selectFrom('user').select(['id', 'email', 'type']).execute();
};

export const getUserPreview = async (userId: string): Promise<AdminUserPreview_Endpoint> => {
  const { used, max } = await getLimitsForUser(userId);

  const itemCountStr = await db
    .selectFrom('item')
    .select(({ fn }) => fn.count<string>('id').as('itemCount'))
    .where('user_id', '=', userId)
    .executeTakeFirst();

  return {
    usedSpace: used,
    maxSpace: max,
    itemCount: Number(itemCountStr?.itemCount),
  };
};

export const getAllUsersSpaceUsage = async (): Promise<
  Array<{ user_id: string; total: number }>
> => {
  const queryResult = await sql<{
    user_id: string;
    total: string;
  }>`SELECT user_id, SUM(size) AS total
       FROM (SELECT id, user_id
         FROM item) AS user_items
            LEFT JOIN (SELECT item_id, size
               FROM image
               UNION ALL
               SELECT item_id, size
               FROM video
               UNION ALL
               SELECT item_id, size
               FROM thumbnail) AS combined_sizes ON user_items.id = combined_sizes.item_id
       GROUP BY user_items.user_id;`.execute(db);

  return queryResult.rows.map((row) => ({
    user_id: row.user_id,
    total: Number(row.total),
  }));
};

export const getUsersItemCounts = async () => {
  const queryResult = await sql<{ user_id: string; itemCount: string }>`
    SELECT user_id, COUNT(id) AS itemCount
    FROM item
    GROUP BY user_id;`.execute(db);

  return queryResult.rows.map((row) => ({
    user_id: row.user_id,
    itemCount: Number(row.itemCount),
  }));
};
