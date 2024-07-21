'use client';
import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStory } from '@/utils/hooks/useStory';
import { useStoryStore } from '@/app/story/edit/story.store';
import { Button, Stack, Textarea, TextInput, Title } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '@/utils/API';
import { notifications } from '@mantine/notifications';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { PostEditStory_EndpointPayload } from '@cerebro/shared';
import { useForm } from '@mantine/form';

const StoryEditPage = () => {
  const searchParams = useSearchParams();
  const storyId = searchParams.get('storyId')!;

  const queryClient = useQueryClient();
  const storyQuery = useStory(storyId);
  const storyStore = useStoryStore();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      title: '',
      desc: '',
    },

    validate: {
      title: (value) => {
        if (value.length < 2) {
          return 'Title must be at least 2 characters';
        }
      },
    },
  });

  useEffect(() => {
    if (!storyQuery.data) return;

    form.setValues({
      title: storyQuery.data.story.title ?? '',
      desc: storyQuery.data.story.description ?? '',
    });

    // todo: maybe set default story on server when creating
    if (storyQuery.data.story.story_json) {
      storyStore.setStory(storyQuery.data.story.story_json);
    }
  }, [storyQuery.data]);

  const editStory = useMutation({
    mutationFn: (values: { title: string; desc: string }) =>
      API.post(`/story/edit/${storyId}`, {
        storyId,
        title: values.title,
        description: values.desc,
      } satisfies PostEditStory_EndpointPayload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['story', storyId],
      });
    },
    onError: (e) => {
      notifications.show({
        color: 'red',
        title: 'Failed to change story',
        message: parseErrorResponse(e)?.general,
      });
    },
  });

  return (
    <Stack>
      <Title>Editing story:</Title>
      <form onSubmit={form.onSubmit((vals) => editStory.mutate(vals))}>
        <Stack>
          <TextInput label="Title" {...form.getInputProps('title')} />
          <Textarea label="Description" {...form.getInputProps('desc')} />

          <Button type="submit" loading={editStory.isPending}>
            Save
          </Button>
        </Stack>
      </form>

      <details open>
        <summary>Story</summary>
        <pre>{JSON.stringify(storyQuery.data, null, 2)}</pre>
      </details>
    </Stack>
  );
};

export default StoryEditPage;
