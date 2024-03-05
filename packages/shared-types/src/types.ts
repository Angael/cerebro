// Prisma generates this, manually update this with migrations
export const ItemType = {
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
} as const;

export type VideoData = {
  src: string;
  width: number;
  height: number;
  durationMs: number;
  bitrateKb: number;
};

export type ImageData = {
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
  image: ImageData;
} & BaseItem;

export type VideoItem = {
  type: typeof ItemType.VIDEO;
  video: VideoData;
} & BaseItem;

export type FrontItem = ImageItem | VideoItem;
