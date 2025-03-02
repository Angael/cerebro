import { FoodLog, FoodProduct } from '@cerebro/db';
import { z } from 'zod';

// This file exists, because frontend imports types from backend.
// Sadly bundlers dont like different import aliases like @/
export type QueryFoodToday = FoodLog[];

export type QueryMyProducts = FoodProduct[];

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
  foodProduct: zQueryScannedCode,
  amount: z.number(),
  date: z.string().datetime(),
});
export type InsertedFoodLog = z.infer<typeof zInsertedFoodLog>;

// brands, product_name,amount, kcal, kcal_100g, DATE(date) as dayDate
export const zFoodHistory = z.array(
  z.object({
    id: z.number(),
    brands: z.string(),
    product_name: z.string(),
    amount: z.number(),
    kcal: z.number(),
    kcal_100g: z.number(),
    dayDate: z.date().transform((d) => d.toISOString()),
  }),
);
export type QueryFoodHistory = z.infer<typeof zFoodHistory>;
