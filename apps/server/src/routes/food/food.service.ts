import ky from 'ky';
import { InsertedFoodLog, QueryScannedCode, zQueryScannedCode } from './food.model';
import { openFoodApiCache } from '@/cache/caches';
import { db, FoodLog, FoodProduct } from '@cerebro/db';
import { HTTPException } from 'hono/http-exception';
import logger from '@/utils/log';
import { sql } from 'kysely';

export async function getTodayFoods(userId: string): Promise<FoodLog[]> {
  // todo add date filter
  return await db
    .selectFrom('food_log')
    .selectAll()
    .where('user_id', '=', userId)
    .where(sql<any>`DATE(\`date\`) = CURDATE()`)
    .execute();
}

// getMyProducts
export async function getMyProducts(userId: string): Promise<FoodProduct[]> {
  return await db.selectFrom('food_product').selectAll().where('user_id', '=', userId).execute();
}

// mocked
export const getFoodByBarcode = async (code: string): Promise<QueryScannedCode> => {
  if (openFoodApiCache.has(code)) {
    return openFoodApiCache.get(code)!;
  }

  const json = await ky
    .get<{ product: QueryScannedCode }>(
      `https://world.openfoodfacts.org/api/v3/product/${code}.json`,
      {
        searchParams: {
          fields: 'product_name,brands,nutriments,image_url,product_quantity,product_quantity_unit',
        },
      },
    )
    .json()
    .catch((e) => {
      logger.error('Failed to fetch openfoodfacts data, barcode: %s, %s', code, String(e));
      throw new HTTPException(500, {
        message: `Failed to retrieve product's data, barcode: ${code}`,
      });
    });

  try {
    const product = zQueryScannedCode.parse({ ...json.product, code });

    openFoodApiCache.set(code, product);
    return product;
  } catch (e) {
    logger.error('Failed to parse openfoodfacts response', e);
    throw new HTTPException(500, { message: "Failed to retrieve all product's data" });
  }
};

// TODO: expand to support also custom foods
export const insertFoodLog = async (userId: string, payload: InsertedFoodLog) => {
  const { foodProduct, amount, date } = payload;
  const kcal = foodProduct.nutriments['energy-kcal_100g'] * (amount / 100);

  return await db
    .insertInto('food_log')
    .values([
      {
        user_id: userId,
        barcode: foodProduct.code,
        kcal,
        kcal_100g: foodProduct.nutriments['energy-kcal_100g'],
        product_name: foodProduct.product_name,
        brands: foodProduct.brands,
        amount,
        date: new Date(date),
      },
    ])
    .execute();
};
