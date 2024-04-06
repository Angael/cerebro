import { limitsConfig } from '@/utils/limits.js';
import { usedSpaceCache, userTypeCache } from '@/cache/userCache.js';
import { db, UserType } from '@cerebro/db';
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
    const images_used_space = (await db
      .selectFrom('image')
      .select((eb) => eb.fn.sum<number>('size').as('used_space'))
      .where((eb) =>
        eb(
          'image.item_id',
          'in',
          eb.selectFrom('item').select(['id', 'size']).where('user_id', '=', user_id),
        ),
      )
      .executeTakeFirst()) ?? { used_space: 0 };

    const videos_used_space = (await db
      .selectFrom('video')
      .select((eb) => eb.fn.sum<number>('size').as('used_space'))
      .where((eb) =>
        eb(
          'video.item_id',
          'in',
          eb.selectFrom('item').select(['id', 'size']).where('user_id', '=', user_id),
        ),
      )
      .executeTakeFirst()) ?? { used_space: 0 };

    const thumbnails_used_space = (await db
      .selectFrom('thumbnail')
      .select((eb) => eb.fn.sum<number>('size').as('used_space'))
      .where((eb) =>
        eb(
          'thumbnail.item_id',
          'in',
          eb.selectFrom('item').select(['id', 'size']).where('user_id', '=', user_id),
        ),
      )
      .executeTakeFirst()) ?? { used_space: 0 };

    used =
      images_used_space.used_space +
      videos_used_space.used_space +
      thumbnails_used_space.used_space;

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
