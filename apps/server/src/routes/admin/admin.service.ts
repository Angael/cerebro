import { db } from '@cerebro/db';
import { AdminAllUsers } from '@cerebro/shared';

export const getAllUsers = async (): Promise<AdminAllUsers> => {
  const users = await db.selectFrom('user').select(['id', 'email', 'type']).execute();

  return users;
};
