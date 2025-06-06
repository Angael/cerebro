'use server';
import { z } from 'zod';
import { requireUser } from '@/server/auth/getUser';
import { db } from '@cerebro/db';
import { startSpan } from '@sentry/nextjs';

const zNewProduct = z.object({
  code: z.string().nullable(),
  name: z.string(),
  kcal: z.number(),
  size: z.number(),
});

export const postNewFoodProduct = async (newProduct: z.infer<typeof zNewProduct>) => {
  const user = await requireUser();

  const { code, name, kcal, size } = zNewProduct.parse(newProduct);

  const product = {
    user_id: user.id,
    barcode: code,
    product_name: name,
    kcal_100g: kcal,
    product_quantity: size,
  };

  return startSpan({ name: 'SF_postNewFoodProduct', op: 'db' }, async () => {
    const result = await db.insertInto('food_product').values(product).execute();
    const insertedId = result[0]?.insertId;

    return await db
      .selectFrom('food_product')
      .selectAll()
      .where('id', '=', Number(insertedId))
      .executeTakeFirstOrThrow();
  });
};
