import { useQuery } from '@tanstack/react-query';
import { API } from '@/utils/API';
import { GetStory_Endpoint } from '@cerebro/shared';
import { QUERY_KEYS } from '@/utils/consts';

export const useStory = (storyId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.story, storyId],
    queryFn: () => API.get<GetStory_Endpoint>(`/story/get/${storyId}`).then((res) => res.data),
  });
};
