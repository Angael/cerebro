import z from 'zod';
import { honoFactory } from '../honoFactory.js';

import { requireSession } from '@/middleware/requireSession.js';
import logger from '@/utils/log.js';
import { FoodProduct } from '@cerebro/db';
import { zValidator } from '@hono/zod-validator';
import { deleteFoodLog, getFoodLogsInDay, getDaysFoods, insertFoodLog } from './food-log.js';
import { createProduct, getFoodByBarcode, getMyProducts } from './food-product.js';
import {
  QueryFoodToday,
  QueryMyProducts,
  zDeleteFoodLog,
  zInsertedFoodLog,
  zNewProduct,
} from './food.model.js';

const foodRoutes = honoFactory();

foodRoutes.get('/food/today', async (c) => {
  const { user } = await requireSession(c);

  const result = await getFoodLogsInDay(user?.id);

  logger.info('Getting food today for user %s', user?.id);
  return c.json(result satisfies QueryFoodToday);
});

foodRoutes.get('/food/history', async (c) => {
  const { user } = await requireSession(c);

  const result = await getDaysFoods(user?.id);

  logger.info('Getting food history for user %s', user?.id);
  return c.json(result);
});

foodRoutes.get('/food/my-products', async (c) => {
  const { user } = await requireSession(c);

  const result = await getMyProducts(user?.id);

  logger.info('Getting food today for user %s', user?.id);
  return c.json(result satisfies QueryMyProducts);
});

foodRoutes.post('/food/product', zValidator('json', zNewProduct), async (c) => {
  const { user } = await requireSession(c);
  const payload = c.req.valid('json');

  const createdProduct = await createProduct(user?.id, payload);
  return c.json(createdProduct);
});

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
