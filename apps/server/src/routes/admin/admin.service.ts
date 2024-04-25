import { db } from '@cerebro/db';
import { AdminAllUsers, AdminUserPreview_Endpoint } from '@cerebro/shared';
import { getLimitsForUser, getSpaceUsedByUser } from '@/routes/user/user.service.js';

export const getAllUsers = async (): Promise<AdminAllUsers> => {
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
