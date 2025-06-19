'use server';
import { requireUser } from '@/server/auth/getUser';
import { startSpan } from '@sentry/nextjs';
import { z } from 'zod';

const zFoodProduct = z.object({
  id: z.coerce.number().int(), // barcode, inserted by cerebro
  product_name: z.string().min(1).trim(),
  brands: z.string().trim().optional(),
  kcal_100g: z.coerce.number().positive().optional(),
  image_url: z.string().trim().optional(),
  product_quantity: z.coerce.number().optional(),
});

export const editFoodProduct = async (formData: FormData) =>
  startSpan({ name: 'SF_editFoodProduct', op: 'db' }, async () => {
    const user = await requireUser();

    const parsedData = zFoodProduct.parse(Object.fromEntries(formData.entries()));

    console.log('parsed data:', parsedData);

    return;
  });
