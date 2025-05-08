import { z } from 'zod';

export const zQueryScannedCode = z.object({
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
export type QueryScannedCode = z.infer<typeof zQueryScannedCode>;

export const zInsertedFoodLog = z.object({
  foodProductId: z.number(),
  amount: z.number(),
  date: z.string().datetime(),
});
export type InsertedFoodLog = z.infer<typeof zInsertedFoodLog>;

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
export type QueryFoodHistory = z.infer<typeof zFoodHistory>;

export const zDeleteFoodLog = z.object({ foodId: z.string() });
export type DeleteFoodLog = z.infer<typeof zDeleteFoodLog>;

export const zNewProduct = z.object({
  code: z.string().nullable(),
  name: z.string(),
  kcal: z.number(),
  size: z.number(),
});
export type NewProduct = z.infer<typeof zNewProduct>;
