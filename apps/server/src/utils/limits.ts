import { GB } from './consts.js';
import { UserType } from '@cerebro/db';

export const limitsConfig = {
  FREE: 0,
  PREMIUM: 1 * GB,
  ADMIN: 1 * GB,
} satisfies Record<UserType, number>;
