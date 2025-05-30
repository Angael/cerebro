'use server';
import { z } from 'zod';
import { requireUser } from '@/server/auth/getUser';
import { unstable_cacheLife as cacheLife } from 'next/cache';
import { db } from '@cerebro/db';
import { captureException, startInactiveSpan, startSpan } from '@sentry/nextjs';
import { tryCatch } from '@/utils/tryCatch';

const zString = z.string().min(1).max(500);

const zQueryScannedCode = z.object({
  code: z.string(), // barcode, inserted by cerebro
  product_name: z.string(),
  brands: z.string().optional(),
  nutriments: z.object({
    'energy-kcal_100g': z.number(),
    fat_100g: z.number().optional(),
    carbohydrates_100g: z.number().optional(),
    proteins_100g: z.number().optional(),
  }),
  image_url: z.string().optional(),
  product_quantity: z.string().optional(),
  product_quantity_unit: z.string().optional(),
});

const requestedFields = [
  'product_name',
  'brands',
  'nutriments',
  'image_url',
  'product_quantity',
  'product_quantity_unit',
].join(',');

async function insertFoodProduct(
  product: z.infer<typeof zQueryScannedCode>,
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

  try {
    await db.insertInto('food_product').values(inserted_product).execute();
  } catch (e) {
    throw new Error('Failed to insert product');
  }
}

const getFood = async (userId: string, barcode: string) => {
  'use cache';
  cacheLife('days');

  const productFromDbQuery = db
    .selectFrom('food_product')
    .selectAll()
    .where('barcode', '=', barcode)
    // If user_id is null, it's a global product
    .where((eb) => eb.or([eb('user_id', '=', userId || null), eb('user_id', 'is', null)]));

  const productFromDb = await startSpan({ name: 'productFromDb', op: 'db' }, () =>
    productFromDbQuery.executeTakeFirst().catch(() => null),
  );

  if (productFromDb) {
    return productFromDb;
  }

  const url = new URL(`https://world.openfoodfacts.org/api/v3/product/${barcode}.json`);
  url.searchParams.append('fields', requestedFields); // Assuming requestedFields is a string or can be appended directly

  const response = await startSpan({ name: 'fetch openfoodfacts', op: 'fetch' }, () =>
    fetch(url.toString()),
  );

  if (!response.ok) {
    if (response.status === 404) {
      captureException(new Error(`Product not found for barcode: ${barcode}`));
    }

    return { error: 'Product not found' };
  }

  const json = await response.json();

  const { data: product, error } = await tryCatch(
    zQueryScannedCode.parseAsync({ ...json.product, code: barcode }),
  );

  if (error) {
    return { error: "Failed to retrieve all product's data" };
  }

  try {
    await startSpan({ name: 'insertFoodProduct', op: 'db' }, () => insertFoodProduct(product));
  } catch (e) {
    if (e instanceof Error) {
      return { error: e.message };
    }
  }

  try {
    // Unnecessary work, but makes sure schema is correct, i am lazy
    return await startSpan({ name: 'returning found product', op: 'db' }, () =>
      productFromDbQuery.executeTakeFirstOrThrow(),
    );
  } catch (e) {
    return { error: "Failed to retrieve all product's data" };
  }
};

export const getFoodByBarcode = async (barcode: string) => {
  const user = await requireUser();

  const parsedCode = zString.parse(barcode);

  return startSpan({ name: 'SF_getFoodByBarcode' }, () => getFood(user.id, parsedCode));
};
