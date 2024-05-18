import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/utils/consts';
import { API } from '@/utils/API';
import { GetUploadLimits } from '@cerebro/shared';

export const useUserLimits = () =>
  useQuery({
    queryKey: [QUERY_KEYS.uploadLimits],
    queryFn: async () =>
      API.get<GetUploadLimits>('/user/limits')
        .then((res) => res.data)
        .catch(() => ({ max: 0, used: 0 })),
    refetchOnWindowFocus: true,
  });
