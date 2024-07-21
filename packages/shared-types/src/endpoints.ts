import { FrontItem } from './types.js';
import { StripeCustomer } from '@cerebro/db';
import { StoryEntity, StorySummary } from './types.js';

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

export type GetStories_Endpoint = {
  count: number;
  stories: StorySummary[];
};

export type GetStory_Endpoint = {
  story: StoryEntity;
};

export type PostEditStory_EndpointPayload = {
  title: string;
  description: string;
};
