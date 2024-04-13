import { Cache } from './typedCache.js';

export const linkStatsCache = new Cache<{ views: number; downloads: number }>({
  stdTTL: 3600 / 4, // 15 minutes
});
