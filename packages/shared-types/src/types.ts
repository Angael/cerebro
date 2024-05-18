import { MediaType } from '@cerebro/db';

export type VideoData = {
  mediaType: MediaType;
  src: string;
  width: number;
  height: number;
  durationMs: number;
  bitrateKb: number;
};

export type ImageData = {
  mediaType: MediaType;
  src: string;
  width: number;
  height: number;
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
  type: 'IMAGE';
  images: ImageData[];
} & BaseItem;

export type VideoItem = {
  type: 'VIDEO';
  videos: VideoData[];
} & BaseItem;

export type FrontItem = ImageItem | VideoItem;

export type AuthorQuery = 'my' | 'all' | 'other';
