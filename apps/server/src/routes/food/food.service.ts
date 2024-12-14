import { QueryFoodToday, QueryScannedCode } from './food.routes';

// mocked
export function getTodayFoods(userId: string): QueryFoodToday {
  return { foods: ['test'] };
}

// mocked
export const getFoodByBarcode = (code: string): QueryScannedCode => {
  return {
    name: 'test',
    cal_per_100g: 100,
    full_weight: 100,
    preview_img: null,
  };
};
