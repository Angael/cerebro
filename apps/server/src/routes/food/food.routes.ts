import z from 'zod';
import { honoFactory } from '../honoFactory.js';

import { requireSession } from '@/middleware/requireSession.js';
import logger from '@/utils/log.js';
import { zValidator } from '@hono/zod-validator';
import { getFoodByBarcode, getMyProducts, getTodayFoods } from './food.service.js';
import { QueryFoodToday, QueryMyProducts, QueryScannedCode } from './food.model.js';

const foodRoutes = honoFactory();

foodRoutes.get('/food/today', async (c) => {
  const { user } = await requireSession(c);

  const result = await getTodayFoods(user?.id);

  logger.info('Getting food today for user %s', user?.id);
  return c.json(result satisfies QueryFoodToday);
});

foodRoutes.get('/food/my-products', async (c) => {
  const { user } = await requireSession(c);

  const result = await getMyProducts(user?.id);

  logger.info('Getting food today for user %s', user?.id);
  return c.json(result satisfies QueryMyProducts);
});

foodRoutes.get(
  '/food/barcode/:code',
  zValidator('param', z.object({ code: z.string() })),
  async (c) => {
    const { code } = c.req.valid('param');
    const result = await getFoodByBarcode(code);

    if (result) {
      // set cache header for 7 days
      c.header('Cache-Control', 'public, max-age=604800');
    }

    return c.json(result satisfies QueryScannedCode);
  },
);

export default foodRoutes;
