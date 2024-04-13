import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';
import { API } from '@/utils/API';
import { UserMe } from '@cerebro/shared';

const queryFn = () => API.get<UserMe>('/user/me').then((res) => res.data);

export const useCurrentUser = () =>
  useQuery({
    queryKey: [QUERY_KEYS.user],
    queryFn,
  });
