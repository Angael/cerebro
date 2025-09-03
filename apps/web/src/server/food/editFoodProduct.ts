'use server';
import { requireUser } from '@/server/auth/getUser';
import { startSpan } from '@sentry/nextjs';
import { z } from 'zod';
import { getFoodProduct } from './getFoodProduct';
import { db } from '@cerebro/db';

const zFoodProduct = z.object({
  id: z.coerce.number().int(), // barcode, inserted by cerebro
  product_name: z.string().min(1).trim(),
  brands: z.string().trim().optional(),
  kcal_100g: z.coerce.number().positive().optional(),
  image_url: z.string().trim().optional(),
  product_quantity: z.coerce.number().optional(),
});

export const editFoodProduct = async (product: z.infer<typeof zFoodProduct>) =>
  startSpan({ name: 'SF_editFoodProduct' }, async () => {
    console.log('### ###');
    const parsedData = zFoodProduct.safeParse(product);

    console.log({ parsedData });

    if (parsedData.error) {
      console.error('Validation error:', parsedData.error);
      return { error: parsedData.error.issues };
    }

    const [user, foodProduct] = await Promise.all([requireUser(), getFoodProduct(parsedData.id)]);

    console.log('parsed data:', parsedData);
    if (foodProduct.user_id !== user.id) {
      throw new Error('You are not allowed to edit this product');
    }

    await startSpan({ name: 'editing food log', parentSpan, op: 'db' }, () =>
      db
        .updateTable('food_product')
        .set({
          kcal,
          kcal_100g,
          amount,
          date: new Date(date),
        })
        .where('id', '=', foodLogId)
        .where('user_id', '=', user.id)
        .execute(),
    );

    return { error: null };
  });
