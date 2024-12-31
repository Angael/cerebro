import z from 'zod';
import { honoFactory } from '../honoFactory.js';

import { requireSession } from '@/middleware/requireSession.js';
import logger from '@/utils/log.js';
import { zValidator } from '@hono/zod-validator';
import { getFoodByBarcode, getMyProducts, getTodayFoods } from './food.service.js';
import { FoodLog, FoodProduct } from '@cerebro/db';

const foodRoutes = honoFactory();

export type QueryFoodToday = FoodLog[];

foodRoutes.get('/food/today', async (c) => {
  const { user } = await requireSession(c);

  const result = await getTodayFoods(user?.id);

  logger.info('Getting food today for user %s', user?.id);
  return c.json(result satisfies QueryFoodToday);
});

export type QueryMyProducts = FoodProduct[];

foodRoutes.get('/food/my-products', async (c) => {
  const { user } = await requireSession(c);

  const result = await getMyProducts(user?.id);

  logger.info('Getting food today for user %s', user?.id);
  return c.json(result satisfies QueryMyProducts);
});

export interface QueryScannedCode {
  product_name: string;
  brands: string;
  nutriments: {
    energy: number;
    'energy-kcal': number;
    'energy-kcal_100g': number;
    fat_100g: number;
    carbohydrates_100g: number;
    proteins_100g: number;
  };
  image_url: string;
  product_quantity: number;
  product_quantity_unit: string;
}

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
