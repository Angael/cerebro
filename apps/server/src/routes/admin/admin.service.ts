import { db } from '@cerebro/db';
import { AdminUserPreview_Endpoint } from '@cerebro/shared';
import { getLimitsForUser } from '@/routes/user/user.service.js';
import { sql } from 'kysely';

export const getAllUsers = async () => {
  return await db.selectFrom('user').select(['id', 'email', 'type']).execute();
};

export const getUserPreview = async (userId: string): Promise<AdminUserPreview_Endpoint> => {
  const {
    bytes: { used, max },
  } = await getLimitsForUser(userId);

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

// SELECT user_id, SUM(size) AS total
// FROM (SELECT id, user_id
//       FROM item) AS user_items
//          LEFT JOIN (SELECT item_id, size
//                     FROM image
//                     UNION ALL
//                     SELECT item_id, size
//                     FROM video
//                     UNION ALL
//                     SELECT item_id, size
//                     FROM thumbnail) AS combined_sizes ON user_items.id = combined_sizes.item_id
// GROUP BY user_items.user_id;

export const getAllUsersSpaceUsage = async (): Promise<
  Array<{ user_id: string; total: number }>
> => {
  // TODO: FINISH typing this and use it in front
  const queryResult = await sql<{
    user_id: string;
    total: number;
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

  console.log(queryResult);

  return queryResult.rows;
};
