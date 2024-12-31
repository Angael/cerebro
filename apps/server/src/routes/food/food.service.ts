import ky from 'ky';
import { QueryScannedCode } from './food.model';
import { openFoodApiCache } from '@/cache/caches';
import { db, FoodLog, FoodProduct } from '@cerebro/db';

export async function getTodayFoods(userId: string): Promise<FoodLog[]> {
  // todo add date filter
  return await db.selectFrom('food_log').selectAll().where('user_id', '=', userId).execute();
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
    .json();

  const product = json.product;

  openFoodApiCache.set(code, product);
  return product;
};
