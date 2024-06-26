import { Thumbnail, ThumbnailType } from '@cerebro/db';

export interface IThumbnailBeforeUpload {
  thumbnail: Omit<Thumbnail, 'id' | 'created_at'>;
  diskPath: string;
}

export interface IGeneratedThumbnail {
  diskPath: string;
  dimensions: IThumbnailMeasure;
  size: number;
  animated: boolean;
}

export type IThumbnailMeasure = {
  type: ThumbnailType;
  width: number;
  height: number;
};
