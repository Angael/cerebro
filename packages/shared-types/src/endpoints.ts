import { FrontItem } from './types.js';

export type QueryItems = {
  count: number;
  items: FrontItem[];
};

export type GetUploadLimits = {
  type: string;
  bytes: { used: number; max: number };
};
