import z from 'zod';
import { honoFactory } from '../honoFactory.js';

import { requireSession } from '@/middleware/requireSession.js';
import logger from '@/utils/log.js';
import { FoodProduct } from '@cerebro/db';
import { zValidator } from '@hono/zod-validator';
import { deleteFoodLog, insertFoodLog } from './food-log.js';
import { getFoodByBarcode } from './food-product.js';
import { zDeleteFoodLog, zInsertedFoodLog } from './food.model.js';

const foodRoutes = honoFactory();

foodRoutes.get(
  '/food/barcode/:code',
  zValidator('param', z.object({ code: z.string() })),
  async (c) => {
    const { user } = await requireSession(c);
    const { code } = c.req.valid('param');
    const result = await getFoodByBarcode(code, user.id);

    if (result) {
      // set cache header for 7 days
      c.header('Cache-Control', 'public, max-age=604800');
    }

    return c.json(result satisfies FoodProduct);
  },
);

foodRoutes.post('/food/consumed-product', zValidator('json', zInsertedFoodLog), async (c) => {
  const { user } = await requireSession(c);
  const payload = c.req.valid('json');

  await insertFoodLog(user.id, payload);
  logger.info('Inserted food log for user %s', user.id);

  return c.json(null);
});

foodRoutes.delete('/food/log/:foodId', zValidator('param', zDeleteFoodLog), async (c) => {
  const { user } = await requireSession(c);
  const { foodId } = c.req.valid('param');

  await deleteFoodLog(user.id, Number(foodId));
  logger.info('Deleted food log for user %s', user.id);

  return c.json(null);
});

export default foodRoutes;
