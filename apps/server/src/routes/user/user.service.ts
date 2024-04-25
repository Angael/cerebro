import { limitsConfig } from '@/utils/limits.js';
import { usedSpaceCache, userTypeCache } from '@/cache/userCache.js';
import { db, UserType } from '@cerebro/db';
import { sql } from 'kysely';

import { MyFile } from '../items/upload/upload.type.js';
import { HttpError } from '@/utils/errors/HttpError.js';
import { GetUploadLimits } from '@cerebro/shared';
import logger from '@/utils/log.js';

/* TODO
This would be good as single query to get sum of all sizes
SELECT SUM(size) AS total_size
  FROM (
    SELECT size FROM Image WHERE Image.item_id IN (SELECT id FROM Item WHERE user_id = ${user_id})
    UNION ALL
    SELECT size FROM Video WHERE Video.item_id IN (SELECT id FROM Item WHERE user_id = ${user_id})
    UNION ALL
    SELECT size FROM Thumbnail WHERE Thumbnail.item_id IN (SELECT id FROM Item WHERE user_id = ${user_id})
  ) AS combined_sizes;
 */

export const getSpaceUsedByUser = async (user_id: string): Promise<number> => {
  let used: number;
  if (usedSpaceCache.has(user_id)) {
    used = usedSpaceCache.get(user_id) as number;
  } else {
    const { rows } = await sql<{ total: string }>`SELECT SUM(size) AS total
  FROM (
    SELECT size FROM image WHERE image.item_id IN (SELECT id FROM item WHERE item.user_id = ${user_id})
    UNION ALL
    SELECT size FROM video WHERE video.item_id IN (SELECT id FROM item WHERE item.user_id = ${user_id})
    UNION ALL
    SELECT size FROM thumbnail WHERE thumbnail.item_id IN (SELECT id FROM item WHERE item.user_id = ${user_id})
  ) AS combined_sizes;`.execute(db);

    used = Math.round(Number(rows[0]?.total || 0));

    usedSpaceCache.set(user_id, used);
  }

  return used;
};

export async function getUserType(uid: string): Promise<UserType> {
  if (userTypeCache.has(uid)) {
    return userTypeCache.get(uid) as UserType;
  } else {
    try {
      const { type } = await db
        .selectFrom('user')
        .select('type')
        .where('id', '=', uid)
        .executeTakeFirstOrThrow();

      userTypeCache.set(uid, type);
      return type;
    } catch (e) {
      logger.error('Failed to get userType for uid: %n, %o', uid, e);
      throw new HttpError(404);
    }
  }
}

export async function getLimitsForUser(userId: string): Promise<GetUploadLimits> {
  const type = await getUserType(userId);
  const max = limitsConfig[type];
  const used: number = await getSpaceUsedByUser(userId);

  return { type, bytes: { used, max } };
}

export async function doesUserHaveSpaceLeftForFile(userId: string, file: MyFile) {
  const limits = await getLimitsForUser(userId);
  const spaceLeft = limits.bytes.max - limits.bytes.used;
  return spaceLeft - file.size > 0;
}
