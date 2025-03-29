import { useQuery } from '@tanstack/react-query';
import { useCurrentUser } from './useCurrentUser';
import { QUERY_KEYS } from '../consts';
import { API } from '../API';
import { GoalsType } from '@cerebro/server/src/routes/goals/goals.model';

export const useFoodGoals = (user: ReturnType<typeof useCurrentUser>) => {
  return useQuery({
    enabled: !!user.data,
    queryKey: [QUERY_KEYS.foodGoals],
    queryFn: () => API.get<GoalsType | null>('/goals/current').then((r) => r.data),
  });
};
