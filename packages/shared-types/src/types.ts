import * as DbTypes from '@cerebro/db';

export type VideoData = {
  mediaType: DbTypes.MediaType;
  src: string;
  width: number;
  height: number;
  durationMs: number;
  bitrateKb: number;
  size: number;
};

export type ImageData = {
  mediaType: DbTypes.MediaType;
  src: string;
  width: number;
  height: number;
  size: number;
};

export type BaseItem = {
  id: number;
  isMine: boolean;
  private: boolean;
  createdAt: string;

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

export namespace Storyteller {
  export type StoryEntity = DbTypes.StoryEntity;
  export type StorySummary = Pick<StoryEntity, 'id' | 'title' | 'description'>;
  export type StoryJson = DbTypes.StoryJson;
  export type Chapter = DbTypes.Chapter;
  export type Scene = DbTypes.Scene;
  export type StoryDialog = DbTypes.StoryDialog;
  export type StoryDialogChoice = DbTypes.StoryDialogChoice;
}
