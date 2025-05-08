import { startSpan } from '@sentry/nextjs';
import { sql } from 'kysely';
import { z } from 'zod';

// Validate response, as query is not typed
export const zFoodHistory = z.array(
  z.object({
    id: z.number(),
    brands: z.string().nullable(),
    product_name: z.string(),
    amount: z.number(),
    kcal: z.number(),
    kcal_100g: z.number(),
    dayDate: z.string().date(),
  }),
);
