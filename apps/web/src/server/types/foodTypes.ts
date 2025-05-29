import { z } from 'zod';

// Validate response, as query is not typed
export const zFoodHistory = z.array(
  z.object({
    id: z.number(),
    food_product_id: z.number().int().positive().nullable(),
    brands: z.string().nullable(),
    product_name: z.string(),
    amount: z.number(),
    kcal: z.number(),
    kcal_100g: z.number(),
    dayDate: z.string().date(),
  }),
);
