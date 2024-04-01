import type { Generated } from 'kysely';

export interface Database {
  user: UserTable;
  user_session: SessionTable;

  item: Item; // TODO rename to Table
  thumbnail: Thumbnail;
  image: Image;
  video: Video;
}

export type UserType = 'PREMIUM' | 'FREE' | 'ADMIN';

interface UserTable {
  id: Generated<number>;
  email: string;
  hashed_password: string;
  type: UserType;
  last_login_at: Date | null;

  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

interface SessionTable {
  id: string;
  user_id: string;
  expires_at: Date;
}

export type ItemType = 'IMAGE' | 'VIDEO';

export type Processed = 'NO' | 'STARTED' | 'FAIL' | 'V1';

interface Item {
  id: Generated<number>;
  user_id: number;

  private: boolean;
  type: ItemType;
  processed: Processed;

  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export type ThumbnailType = 'XS' | 'SM' | 'MD';

interface Thumbnail {
  id: Generated<number>;
  item_id: number;

  type: ThumbnailType;
  path: string;
  size: number;
  width: number;
  height: number;

  created_at: Generated<Date>;
}

export type MediaType = 'SOURCE' | 'COMPRESSED'; // Later 720p, 1080p, 4k, etc.

interface Image {
  id: Generated<number>;
  item_id: number;

  media_type: MediaType;
  path: string;
  size: number;
  width: number;
  height: number;

  created_at: Generated<Date>;
}

interface Video {
  id: Generated<number>;
  item_id: number;

  media_type: MediaType;
  path: string;
  size: number;
  width: number;
  height: number;
  duration_ms: number;
  bitrate_kb: number;

  created_at: Generated<Date>;
}

// export type Person = Selectable<PersonTable>;
// export type NewPerson = Insertable<PersonTable>;
// export type PersonUpdate = Updateable<PersonTable>;
