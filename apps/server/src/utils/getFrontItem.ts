import { Image, Video } from '@cerebro/db';
import { BaseItem, FrontItem, ImageItem, VideoItem } from '@cerebro/shared';
import { s3PathToUrl } from './s3PathToUrl.js';
import { HttpError } from './errors/HttpError.js';
import logger from './log.js';
import { MergedItem } from '@/utils/queryAndMergeItems.js';

export function getFrontItem(merged: MergedItem, user_id?: string): FrontItem {
  const { item, videos, images, thumbnails } = merged;

  const thumbnail = thumbnails.find((e) => e.type === 'MD');
  const icon = thumbnails.find((e) => e.type === 'XS');

  const baseItem: BaseItem = {
    id: item.id,
    isMine: item.user_id === user_id,
    private: item.private,
    createdAt: item.created_at.toISOString(),
    thumbnail: s3PathToUrl(thumbnail?.path),
    icon: s3PathToUrl(icon?.path),
  };

  // Last worst case scenario check
  if (!baseItem.isMine && baseItem.private) {
    throw new HttpError(404);
  }

  if (item.type === 'IMAGE') {
    const sourceImage = images.find((e) => e.media_type === 'SOURCE');
    const compressedImage = images.find((e) => e.media_type === 'COMPRESSED');
    const _images = [sourceImage, compressedImage].filter(Boolean) as Image[];

    return {
      ...baseItem,
      type: 'IMAGE',
      images: _images.map((img) => ({
        mediaType: img.media_type,
        src: s3PathToUrl(img.path),
        height: img.height,
        width: img.width,
        size: img.size,
      })),
    } satisfies ImageItem;
  } else if (item.type === 'VIDEO') {
    const sourceVideo = videos.find((e) => e.media_type === 'SOURCE');
    const compressedVideo = videos.find((e) => e.media_type === 'COMPRESSED');
    const _videos = [sourceVideo, compressedVideo].filter(Boolean) as Video[];

    return {
      ...baseItem,
      type: 'VIDEO',
      videos: _videos.map((vid) => ({
        mediaType: vid.media_type,
        src: s3PathToUrl(vid.path),
        height: vid.height,
        width: vid.width,
        durationMs: vid.duration_ms,
        bitrateKb: vid.bitrate_kb,
        size: vid.size,
      })),
    } satisfies VideoItem;
  } else {
    logger.error('Error when converting item to FrontItem, itemId: %i', item.id);
    // TODO: Maybe queue item for fixing?
    throw new HttpError(500);
  }
}
