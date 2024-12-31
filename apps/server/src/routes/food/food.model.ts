import { FoodLog, FoodProduct } from '@cerebro/db';

// This file exists, because frontend imports types from backend.
// Sadly bundlers dont like different import aliases like @/
export type QueryFoodToday = FoodLog[];

export type QueryMyProducts = FoodProduct[];

export interface QueryScannedCode {
  product_name: string;
  brands: string;
  nutriments: {
    energy: number;
    'energy-kcal': number;
    'energy-kcal_100g': number;
    fat_100g: number;
    carbohydrates_100g: number;
    proteins_100g: number;
  };
  image_url: string;
  product_quantity: number;
  product_quantity_unit: string;
}
