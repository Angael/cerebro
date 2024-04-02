import { limitsConfig } from '@/utils/limits.js';
import { usedSpaceCache, userTypeCache } from '../../cache/userCache.js';
import { db, UserType } from '@cerebro/db';
import { MyFile } from '../items/upload/upload.type.js';
import { HttpError } from '@/utils/errors/HttpError.js';
import { GetUploadLimits } from '@cerebro/shared';
import { sql } from 'kysely';
import invariant from 'tiny-invariant';

export const getSpaceUsedByUser = async (uid: number): Promise<number> => {
  let used: number;
  if (usedSpaceCache.has(uid)) {
    used = usedSpaceCache.get(uid) as number;
  } else {
    // SELECT SUM(size) AS total_size
    // FROM (
    //      SELECT size FROM Image
    //      UNION ALL
    //      SELECT size FROM Video
    //      UNION ALL
    //      SELECT size FROM Thumbnail
    //  ) AS combined_sizes;
    const images_size_sum = await db
      .selectFrom('image')
      .select((eb) => eb.fn.sum('size').as('size_sum'))
      .where((eb) =>
        eb('image.item_id', 'in', eb.selectFrom('item').select('id').where('user_id', '=', uid)),
      );

    const used_size = await sql<number>`SELECT SUM(size) AS total_size
    FROM (
      SELECT size FROM Image WHERE Image.item_id IN (SELECT id FROM Item WHERE user_id = ${uid})
      UNION ALL
      SELECT size FROM Video WHERE Video.item_id IN (SELECT id FROM Item WHERE user_id = ${uid})
      UNION ALL
      SELECT size FROM Thumbnail WHERE Thumbnail.item_id IN (SELECT id FROM Item WHERE user_id = ${uid})
    ) AS combined_sizes;`.execute(db);
    throw new Error('i am not sure what this returns!!!');

    usedSpaceCache.set(uid, used_size.rows[0]);
  }

  return used_size;
};

export async function getUserType(uid: number): Promise<UserType> {
  if (userTypeCache.has(uid)) {
    return userTypeCache.get(uid) as UserType;
  } else {
    try {
      const user = await prisma.user.findFirstOrThrow({ where: { uid }, select: { type: true } });
      if (user.type) {
        userTypeCache.set(uid, user.type);
      }
      return user.type;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          throw new HttpError(404);
        }
      }
      throw e;
    }
  }
}

export async function getLimitsForUser(userId: number): Promise<GetUploadLimits> {
  const type = await getUserType(userId);
  const max = limitsConfig[type];

  const used: number = await getSpaceUsedByUser(userId);

  return { type, bytes: { used, max } };
}

export async function doesUserHaveSpaceLeftForFile(userId: number, file: MyFile) {
  const limits = await getLimitsForUser(userId);

  const spaceLeft = limits.bytes.max - limits.bytes.used;

  return spaceLeft - file.size > 0;
}
