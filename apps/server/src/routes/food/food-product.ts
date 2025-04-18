import { tryCatch } from '@/utils/errors/tryCatch';
import logger from '@/utils/log';
import { db, FoodProduct } from '@cerebro/db';
import { HTTPException } from 'hono/http-exception';
import ky, { HTTPError } from 'ky';
import { NewProduct, QueryScannedCode, zQueryScannedCode } from './food.model';

export async function getMyProducts(userId: string): Promise<FoodProduct[]> {
  return await db
    .selectFrom('food_product')
    .selectAll()
    .where((eb) => eb.or([eb('user_id', '=', userId), eb('user_id', 'is', null)]))
    .execute();
}

export async function insertFoodProduct(
  product: QueryScannedCode,
  userId?: string | null,
): Promise<void> {
  const product_quantity_number = isNaN(Number(product.product_quantity))
    ? null
    : Number(product.product_quantity);

  const inserted_product = {
    user_id: userId,
    barcode: product.code,
    product_name: product.product_name,
    brands: product.brands,
    kcal_100g: product.nutriments['energy-kcal_100g'],
    fat_100g: product.nutriments.fat_100g,
    carb_100g: product.nutriments.carbohydrates_100g,
    proteins_100g: product.nutriments.proteins_100g,
    image_url: product.image_url,
    product_quantity: product_quantity_number,
    product_quantity_unit: product.product_quantity_unit,
  };

  logger.verbose('Inserting product %o', inserted_product);

  try {
    await db.insertInto('food_product').values(inserted_product).execute();
  } catch (e) {
    logger.error('Failed to insert product %o', inserted_product);
    throw new HTTPException(500, { message: 'Failed to insert product' });
  }
}

const requestedFields = [
  'product_name',
  'brands',
  'nutriments',
  'image_url',
  'product_quantity',
  'product_quantity_unit',
].join(',');

export async function getFoodByBarcode(barcode: string, userId?: string): Promise<FoodProduct> {
  const productFromDbQuery = db
    .selectFrom('food_product')
    .selectAll()
    .where('barcode', '=', barcode)
    // If user_id is null, it's a global product
    .where((eb) => eb.or([eb('user_id', '=', userId || null), eb('user_id', 'is', null)]));

  const productFromDb = await productFromDbQuery.executeTakeFirst().catch(() => null);

  if (productFromDb) {
    return productFromDb;
  }

  const json = await ky
    .get<{ product: QueryScannedCode }>(
      `https://world.openfoodfacts.org/api/v3/product/${barcode}.json`,
      { searchParams: { fields: requestedFields } },
    )
    .json()
    .catch((e) => {
      let statusCode: number = 404;
      if (e instanceof HTTPError) {
        logger.error('OpenFoodFacts HTTPError for barcode: %s, error: %s', barcode, e.message);
        statusCode = e.response.status;
      } else {
        logger.error('Failed to fetch openfoodfacts data, barcode: %s, %s', barcode, String(e));
      }

      throw new HTTPException(statusCode as any, {
        message: `Failed to retrieve product's data`,
      });
    });

  logger.verbose('scanned product %o', json.product);

  const { data: product, error } = await tryCatch(
    zQueryScannedCode.parseAsync({ ...json.product, code: barcode }),
  );

  if (error) {
    logger.error('Failed to return product by barcode, openfoodfacts error , %s', error.message);
    throw new HTTPException(500, { message: "Failed to retrieve all product's data" });
  }

  try {
    await insertFoodProduct(product);

    // Unnecessary work, but makes sure schema is correct, i am lazy
    return await productFromDbQuery.executeTakeFirstOrThrow().catch((e) => {
      throw new HTTPException(500, { message: "Failed to retrieve all product's data" });
    });
  } catch (e) {
    logger.error(
      'Failed to insert/query product after getting it from openfoodfacts, %s',
      String(e),
    );
    throw new HTTPException(500, { message: "Failed to retrieve all product's data" });
  }
}

export const createProduct = async (userId: string, payload: NewProduct) => {
  const product = {
    user_id: userId,
    product_name: payload.name,
    kcal_100g: payload.kcal,
    product_quantity: payload.size,
  };

  logger.verbose('Inserting product %o', product);

  try {
    const result = await db.insertInto('food_product').values(product).execute();
    const insertedId = result[0]?.insertId;

    return await db
      .selectFrom('food_product')
      .selectAll()
      .where('id', '=', Number(insertedId))
      .executeTakeFirstOrThrow();
  } catch (e) {
    logger.error('Failed to insert product %o', product);
    throw new HTTPException(500, { message: 'Failed to insert product' });
  }
};
