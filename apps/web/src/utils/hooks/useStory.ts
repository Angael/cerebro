import { useQuery } from '@tanstack/react-query';
import { API } from '@/utils/API';
import { GetStory_Endpoint } from '@cerebro/shared';

export const useStory = (storyId: string) => {
  return useQuery({
    queryKey: ['story', storyId],
    queryFn: () => API.get<GetStory_Endpoint>(`/story/get/${storyId}`).then((res) => res.data),
  });
};
