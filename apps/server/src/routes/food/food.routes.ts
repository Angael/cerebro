import z from 'zod';
import { honoFactory } from '../honoFactory.js';

import { requireSession } from '@/middleware/requireSession.js';
import logger from '@/utils/log.js';
import { zValidator } from '@hono/zod-validator';
import {
  QueryFoodToday,
  QueryMyProducts,
  QueryScannedCode,
  zInsertedFoodLog,
} from './food.model.js';
import { getFoodByBarcode, getMyProducts, getTodayFoods, insertFoodLog } from './food.service.js';

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

foodRoutes.post('/food/consumed-product', zValidator('json', zInsertedFoodLog), async (c) => {
  const { user } = await requireSession(c);
  const payload = c.req.valid('json');

  // TODO remove this
  console.log(payload);

  await insertFoodLog(user.id, payload);
  logger.info('Inserted food log for user %s', user.id);

  return c.json(null);
});

export default foodRoutes;
