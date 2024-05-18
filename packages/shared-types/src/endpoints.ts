import { FrontItem } from './types.js';
import { StripeCustomer } from '@cerebro/db';

export type QueryItems = {
  count: number;
  items: FrontItem[];
};

export type GetUploadLimits = { used: number; max: number };

export type UserMe = {
  id: string;
  email: string;
  type: string;
  sessionExpiresAt: string;
} | null;

export type UserPlan_Endpoint = {
  customerId: string;
  activePlan: StripeCustomer['active_plan'];
  expiresAt: string | null;
} | null;

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
