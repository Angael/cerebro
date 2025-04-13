import { z } from 'zod';

export const zGoals = z.object({
  kcal: z.number().nullable(),
  weight_kg: z.number().nullable(),
  date: z.string().date(),
});
export type GoalsType = z.infer<typeof zGoals>;
