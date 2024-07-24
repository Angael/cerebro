'use client';
import React, { useEffect } from 'react';
import { useStory } from '@/utils/hooks/useStory';
import { useStoryStore } from '@/app/story/edit/story.store';
import {
  Button,
  Card,
  LoadingOverlay,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '@/utils/API';
import { notifications } from '@mantine/notifications';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { PostEditStory_EndpointPayload } from '@cerebro/shared';
import { useForm } from '@mantine/form';
import { useStoryStats } from '@/app/story/edit/useStoryStats';
import { useUrlParam } from '@/utils/hooks/useUrlParam';
import StoryNav from '@/lib/story/StoryNav';

const StoryEditPage = () => {
  const [storyId] = useUrlParam('storyId');
  if (!storyId) throw new Error('storyId is required');

  const queryClient = useQueryClient();
  const storyQuery = useStory(storyId);
  const setStory = useStoryStore((s) => s.setStory);
  const storyJson = useStoryStore((s) => s.storyJson);

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
      setStory(storyQuery.data.story.story_json);
    }
  }, [storyQuery.data]);

  const editStory = useMutation({
    mutationFn: (values: { title: string; desc: string }) =>
      API.post(`/story/edit/${storyId}`, {
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

  const storyStats = useStoryStats(storyJson ?? null);

  return (
    <Stack pos="relative">
      <LoadingOverlay visible={storyQuery.isPending} />
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

      {storyStats && (
        <details>
          <summary>Statistics</summary>
          <Card>
            <Text>Chapters: {storyStats.chapters}</Text>
            <Text>Scenes: {storyStats.scenes}</Text>
            <Text>Dialogs: {storyStats.dialogs}</Text>
            <Text>Choices: {storyStats.choices}</Text>
          </Card>
        </details>
      )}

      {storyJson && <StoryNav storyJson={storyJson} />}

      <Title>TODO Edit dialog here</Title>

      <details>
        <summary>Story JSON</summary>
        <pre>{JSON.stringify(storyJson, null, 2)}</pre>
      </details>
    </Stack>
  );
};

export default StoryEditPage;
