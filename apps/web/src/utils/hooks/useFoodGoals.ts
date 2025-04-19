import { GoalsType } from '@cerebro/server';
import { useQuery } from '@tanstack/react-query';
import { API } from '../API';
import { QUERY_KEYS } from '../consts';

export const useFoodGoals = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.foodGoals],
    queryFn: () => API.get<GoalsType | null>('/goals/current').then((r) => r.data),
  });
};
