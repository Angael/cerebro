import { z } from 'zod';

export const zWeightData = z.object({
  date: z.string().date(),
  weight_kg: z.number(),
});
export type WeightData = z.infer<typeof zWeightData>;
