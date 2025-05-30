'use server';
import { z } from 'zod';
import { requireUser } from '@/server/auth/getUser';
import { db } from '@cerebro/db';
import { startInactiveSpan, startSpan } from '@sentry/nextjs';
import { zSignInForm } from '@/app/signin/signInUtils';

const zFoodProduct = z.object({
  product_name: z.string().min(1, 'Product name is required'),
});

export const editFoodProduct = async (formData: FormData) =>
  startSpan({ name: 'SF_editFoodProduct', op: 'db' }, async () => {
    const user = await requireUser();

    const parsedData = zFoodProduct.parse(Object.fromEntries(formData.entries()));

    console.log('parsed data:', parsedData);

    return;
  });
