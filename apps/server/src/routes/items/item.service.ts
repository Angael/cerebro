import { S3DeleteMany } from '@/aws/s3-helpers.js';
import { getFrontItem } from '@/utils/getFrontItem.js';
import { isUserOrAdmin } from '@/utils/isUserOrAdmin.js';
import logger from '@/utils/log.js';
import { queryAndMergeItems } from '@/utils/queryAndMergeItems.js';
import { db } from '@cerebro/db';
import { AuthorQuery, FrontItem, QueryItems } from '@cerebro/shared';
import { HTTPException } from 'hono/http-exception';
import { MyContext, User } from '../honoFactory';
import invariant from 'tiny-invariant';

export async function getItems(
  limit: number,
  page: number,
  userId: string | undefined,
  author: AuthorQuery,
): Promise<QueryItems> {
  let query = db.selectFrom('item').where('private', '=', false);

  if (author === 'my') {
    if (userId === undefined) {
      query = query.where('user_id', '=', '-'); // should return null?
    } else {
      query = query.where('user_id', '=', userId);
    }
  } else if (author === 'other' && userId !== undefined) {
    query = query.where('user_id', '!=', userId);
  }

  const _items = await query
    .selectAll()
    .limit(limit)
    .offset(page * limit)
    .orderBy('created_at', 'desc')
    .execute();

  const { count } = await query
    .select(({ fn }) => [fn.count<number>('id').as('count')])
    .executeTakeFirstOrThrow();

  const mergedItems = await queryAndMergeItems(_items);
  const frontendItems = mergedItems
    .map((mergedItem) => {
      try {
        return getFrontItem(mergedItem, userId);
      } catch (e) {
        logger.error('Failed to getFrontItem %n', mergedItem.item.id);
        return null as any;
      }
    })
    .filter(Boolean);

  return { items: frontendItems, count };
}

export async function getItem(id: number, userId?: string): Promise<FrontItem> {
  const item = await db.selectFrom('item').selectAll().where('id', '=', id).executeTakeFirst();

  if (item) {
    const [mergedItem] = await queryAndMergeItems([item]);
    invariant(mergedItem, 'mergedItem is undefined');
    return getFrontItem(mergedItem, userId);
  } else {
    throw new HTTPException(404, { message: 'Item not found' });
  }
}

export async function deleteItem(itemId: number, user: User) {
  const row = await db
    .selectFrom('item')
    .select(['user_id'])
    .where('id', '=', itemId)
    .executeTakeFirst();

  if (row) {
    const { user_id } = row;

    if (isUserOrAdmin(user, user_id)) {
      const s3PathsToDelete: string[] = [];
      try {
        const thumbnails = await db
          .selectFrom('thumbnail')
          .select(['path'])
          .where('item_id', '=', itemId)
          .execute();
        thumbnails.forEach((t) => s3PathsToDelete.push(t.path));
        await db.deleteFrom('thumbnail').where('item_id', '=', itemId).execute();

        const images = await db
          .selectFrom('image')
          .select(['path'])
          .where('item_id', '=', itemId)
          .execute();
        images.forEach((i) => s3PathsToDelete.push(i.path));
        await db.deleteFrom('image').where('item_id', '=', itemId).execute();

        const videos = await db
          .selectFrom('video')
          .select(['path'])
          .where('item_id', '=', itemId)
          .execute();
        videos.forEach((v) => s3PathsToDelete.push(v.path));
        await db.deleteFrom('video').where('item_id', '=', itemId).execute();

        await db.deleteFrom('item').where('id', '=', itemId).execute();
      } catch (e) {
        logger.error('failed to delete everything for itemId %s, %O', itemId, e);
      } finally {
        // Better for AWS costs (could lead to orphaned files in S3?)
        await S3DeleteMany(s3PathsToDelete);
      }
    } else {
      throw new HTTPException(403, { message: 'This user cannot delete this item' });
    }
  } else {
    throw new HTTPException(404, { message: 'Item not found' });
  }
}
