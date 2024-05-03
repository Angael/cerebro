import { FrontItem } from './types.js';
import { StriperCustomer } from '@cerebro/db';

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
  sessionExpiresAt: string;
} | null;

export type UserPlan_Endpoint = {
  customerId: string;
  activePlan: StriperCustomer['active_plan'];
  expiresAt: string | null;
};

export type AdminUsers_Endpoint = Array<{
  id: string;
  email: string;
  type: string;
  usedSpace: number;
  maxSpace: number;
  itemCount: number;
}>;

export type AdminUserPreview_Endpoint = {
  usedSpace: number;
  maxSpace: number;
  itemCount: number;
};
