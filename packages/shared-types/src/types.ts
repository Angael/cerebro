import { ItemType, MediaType } from '@cerebro/db';

export type { ItemType } from '@cerebro/db';

export type VideoData = {
  mediaType: keyof typeof MediaType;
  src: string;
  width: number;
  height: number;
  durationMs: number;
  bitrateKb: number;
};

export type ImageData = {
  mediaType: keyof typeof MediaType;
  src: string;
  width: number;
  height: number;
  animated: boolean;
};

export type BaseItem = {
  id: number;
  isMine: boolean;
  private: boolean;
  createdAt: string;
  size: number;

  thumbnail: string | null;
  icon: string | null;
};

export type ImageItem = {
  type: typeof ItemType.IMAGE;
  images: ImageData[];
} & BaseItem;

export type VideoItem = {
  type: typeof ItemType.VIDEO;
  videos: VideoData[];
} & BaseItem;

export type FrontItem = ImageItem | VideoItem;
