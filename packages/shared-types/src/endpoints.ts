import { FrontItem } from './types.js';

export type QueryItems = {
  count: number;
  items: FrontItem[];
};

export type GetUploadLimits = {
  type: string;
  bytes: { used: number; max: number };
};

export type UserMe = {
  id: string;
  email: string;
  type: string;
  sessionExpiresAt: Date;
} | null;

export type AdminUsers_Endpoint = Array<{
  id: string;
  email: string;
  type: string;
  usage: number;
}>;

export type AdminUserPreview_Endpoint = {
  usedSpace: number;
  maxSpace: number;
  itemCount: number;
};
