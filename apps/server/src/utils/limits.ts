import { GB } from './consts.js';
import { UserType } from '@cerebro/db';

export const limitsConfig = {
  FREE: 0,
  PREMIUM: 100 * GB,
  ADMIN: 100 * GB,
} satisfies Record<UserType, number>;
