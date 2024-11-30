import type { ColumnType, Generated, Selectable } from 'kysely';
import { z } from 'zod';
import {
  chapterZod,
  sceneZod,
  storyDialogChoiceZod,
  storyDialogZod,
  storyJsonZod,
} from './typesZod.js';

export interface Database {
  user: UserTable;
  user_session: SessionTable;

  stripe_customer: StripeCustomerTable;
  item: ItemTable;
  thumbnail: ThumbnailTable;
  image: ImageTable;
  video: VideoTable;
  story: StoryTable;
}

export type UserType = 'PREMIUM' | 'FREE' | 'ADMIN';

interface UserTable {
  id: string;
  email: string;
  hashed_password: string;
  type: UserType;
  last_login_at: Date | null;

  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export type User = Selectable<UserTable>;

interface SessionTable {
  id: string;
  user_id: string;
  expires_at: Date;
}

interface StripeCustomerTable {
  id: string;
  user_id: string;
  subscription_id: string | null;
  stripe_customer_id: string;
  active_plan: 'VIP' | 'ACCESS_PLAN' | null; // TODO: Change beta to access
  plan_expiration: Date | null;
}

export type StripeCustomer = Selectable<StripeCustomerTable>;

export type ItemType = 'IMAGE' | 'VIDEO';

export type Processed = 'NO' | 'STARTED' | 'FAIL' | 'V1';

interface ItemTable {
  id: Generated<number>;
  user_id: string;

  private: boolean;
  type: ItemType;

  // TODO: These two should not be part of this table, but part of another table 'queue' perhaps?
  processed: Generated<Processed>; // thumbnails
  optimized: Generated<Processed>; // sharp/ffmpeg compressed versions

  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export type Item = Selectable<ItemTable>;

export type ThumbnailType = 'XS' | 'SM' | 'MD';

interface ThumbnailTable {
  id: Generated<number>;
  item_id: number;

  type: ThumbnailType;
  path: string;
  size: number;
  width: number;
  height: number;

  created_at: Generated<Date>;
}

export type Thumbnail = Selectable<ThumbnailTable>;

export type MediaType = 'SOURCE' | 'COMPRESSED'; // Later 720p, 1080p, 4k, etc.

interface ImageTable {
  id: Generated<number>;
  item_id: number;

  media_type: MediaType;
  path: string;
  size: number;
  width: number;
  height: number;

  created_at: Generated<Date>;
}

export type Image = Selectable<ImageTable>;

interface VideoTable {
  id: Generated<number>;
  item_id: number;

  path: string;
  size: number;
  width: number;
  height: number;
  bitrate_kb: number;
  duration_ms: number;
  media_type: MediaType;

  created_at: Generated<Date>;
}

export type Video = Selectable<VideoTable>;

// export type Person = Selectable<PersonTable>;
// export type NewPerson = Insertable<PersonTable>;
// export type PersonUpdate = Updateable<PersonTable>;

export type StoryDialogChoice = z.infer<typeof storyDialogChoiceZod>;
export type StoryDialog = z.infer<typeof storyDialogZod>;
export type Scene = z.infer<typeof sceneZod>;
export type Chapter = z.infer<typeof chapterZod>;
export type StoryJson = z.infer<typeof storyJsonZod>;

interface StoryTable {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
  story_json: ColumnType<StoryJson | null, string | undefined, string | undefined>;

  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export type StoryEntity = Selectable<StoryTable>;
