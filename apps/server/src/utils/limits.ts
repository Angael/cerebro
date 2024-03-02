import { GB } from './consts.js';
import { UserType } from '@cerebro/db';

export const limitsConfig = {
  [UserType.FREE]: 0,
  [UserType.PREMIUM]: 1 * GB,
  [UserType.ADMIN]: 1 * GB,
} as const;
