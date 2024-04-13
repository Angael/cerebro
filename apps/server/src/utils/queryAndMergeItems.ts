import { db, Image, Item, Thumbnail, Video } from '@cerebro/db';

export interface MergedItem {
  item: Item;
  images: Image[];
  videos: Video[];
  thumbnails: Thumbnail[];
}

export const queryAndMergeItems = async (items: Item[]): Promise<MergedItem[]> => {
  const itemIds = items.map((i) => i.id);
  const images = await db.selectFrom('image').where('item_id', 'in', itemIds).selectAll().execute();
  const videos = await db.selectFrom('video').where('item_id', 'in', itemIds).selectAll().execute();
  const thumbnails = await db
    .selectFrom('thumbnail')
    .where('item_id', 'in', itemIds)
    .selectAll()
    .execute();

  return items.map((item) => {
    return {
      item,
      images: images.filter((image) => image.item_id === item.id),
      videos: videos.filter((video) => video.item_id === item.id),
      thumbnails: thumbnails.filter((thumbnail) => thumbnail.item_id === item.id),
    };
  });
};
