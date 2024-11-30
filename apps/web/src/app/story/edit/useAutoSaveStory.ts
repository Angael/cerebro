import { Storyteller } from '@cerebro/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '@/utils/API';
import { notifications } from '@mantine/notifications';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { useDebouncedEffect } from '@/utils/hooks/useDebouncedEffect';
import { useState } from 'react';

export const useAutoSaveStory = (
  storyId: Storyteller.StoryEntity['id'],
  storyJson: Storyteller.StoryJson | null,
) => {
  const queryClient = useQueryClient();

  const editStory = useMutation({
    mutationFn: (_storyJson: Storyteller.StoryJson) =>
      API.post(`/story/edit-json/${storyId}`, { storyJson: _storyJson }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['story', storyId] }),
    onError: (e) => {
      notifications.show({
        color: 'red',
        title: 'Failed to change story',
        message: parseErrorResponse(e)?.general,
      });
    },
  });

  const [isLoaded, setIsLoaded] = useState(false);
  useDebouncedEffect(
    () => {
      if (!storyJson) return;

      // Skip the first call to avoid saving the story before it's loaded
      if (!isLoaded) {
        setIsLoaded(true);
        return;
      }

      editStory.mutate(storyJson);
    },
    [storyJson],
    2000,
  );

  return editStory;
};
