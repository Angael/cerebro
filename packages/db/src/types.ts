import type { Generated, Selectable } from 'kysely';

export interface Database {
  user: UserTable;
  user_session: SessionTable;

  stripe_customer: StripeCustomerTable;
  item: ItemTable;
  thumbnail: ThumbnailTable;
  image: ImageTable;
  video: VideoTable;

  // Foods
  food_product: FoodProductTable;
  food_log: FoodLogTable;
  food_goal: FoodGoalTable;
  user_weight: UserWeightTable;
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

// Duplicated each scan from openfoodfacts, so it's easier to get last n added products, and makes it faster
interface FoodProductTable {
  id: Generated<number>;
  barcode: string | null;

  user_id: string | null;

  product_name: string;
  brands: string | null;
  image_url: string | null;
  product_quantity: number | null;
  product_quantity_unit: string | null;

  kcal_100g: number;
  fat_100g: number | null;
  carb_100g: number | null;
  proteins_100g: number | null;

  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export type FoodProduct = Selectable<FoodProductTable>;

interface FoodLogTable {
  id: Generated<number>;
  barcode: string | null;

  user_id: string;
  food_product_id: number | null;

  product_name: string; // To not fetch the product again
  brands: string | null; // To not fetch the product again
  amount: number; // grams
  kcal: number;
  kcal_100g: number; // To not fetch the product again

  date: Date;
}

export type FoodLog = Selectable<FoodLogTable>;

interface FoodGoalTable {
  id: Generated<number>;
  user_id: string;

  kcal: number | null;
  fat_g: number | null;
  carb_g: number | null;
  proteins_g: number | null;
  weight_kg: number | null;

  date: Date;
}

export type FoodGoal = Selectable<FoodGoalTable>;

interface UserWeightTable {
  id: Generated<number>;
  user_id: string;

  weight_kg: number;
  date: Date;
}
