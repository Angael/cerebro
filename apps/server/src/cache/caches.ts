import { QueryScannedCode } from '@/routes/food/food.model';
import { Cache } from './typedCache.js';

export const linkStatsCache = new Cache<{ views: number; downloads: number }>({
  stdTTL: 3600 / 4, // 15 minutes
});

export const openFoodApiCache = new Cache<QueryScannedCode>({
  stdTTL: 3600 * 24 * 7, // 7 days
});
