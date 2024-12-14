import { QueryItems } from '@cerebro/shared';
import z from 'zod';
import { honoFactory } from '../honoFactory.js';

import { optionalSession } from '@/middleware/optionalSession.js';
import logger from '@/utils/log.js';
import { zValidator } from '@hono/zod-validator';
import { requireSession } from '@/middleware/requireSession.js';
import { getFoodByBarcode, getTodayFoods } from './food.service.js';

const foodRoutes = honoFactory();

export interface QueryFoodToday {
  foods: string[];
}

foodRoutes.get('/food/today', async (c) => {
  const { user } = await requireSession(c);

  const result = await getTodayFoods(user?.id);

  logger.info('Getting food today for user %s', user?.id);
  return c.json(result satisfies QueryFoodToday);
});

export interface QueryScannedCode {
  name: string;
  cal_per_100g: number;
  full_weight: number | null;
  preview_img: string | null;
}

foodRoutes.get('/food/barcode/:code', zValidator('param', z.object({ code: z.string() })), (c) => {
  const { code } = c.req.valid('param');
  const result = getFoodByBarcode(code);

  if (result) {
    // set cache header for 7 days
    c.header('Cache-Control', 'public, max-age=604800');
  }

  return c.json(result satisfies QueryScannedCode);
});

export default foodRoutes;
