'use client';
import React, { useEffect } from 'react';
import { useStory } from '@/utils/hooks/useStory';
import { useStoryStore } from '@/app/story/edit/story.store';
import { Button, Group, LoadingOverlay, Stack, Textarea, TextInput, Title } from '@mantine/core';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from '@/utils/API';
import { notifications } from '@mantine/notifications';
import { parseErrorResponse } from '@/utils/parseErrorResponse';
import { PostEditStory_EndpointPayload, Storyteller } from '@cerebro/shared';
import { useForm } from '@mantine/form';
import { useStoryStats } from '@/app/story/edit/useStoryStats';
import { useUrlParam } from '@/utils/hooks/useUrlParam';
import StoryNav from '@/lib/story/StoryNav';
import { StoryStats } from '@/app/story/edit/StoryStats';
import StoryViewport from '@/lib/story/story-viewport/StoryViewport';
import EditDialog from '@/lib/story/edit-dialog/EditDialog';
import { useAutoSaveStory } from '@/app/story/edit/useAutoSaveStory';
import StoryTree from '@/lib/story/story-tree/StoryTree';

const StoryEditPage = () => {
  const [storyId] = useUrlParam('storyId');
  if (!storyId) throw new Error('storyId is required');

  const queryClient = useQueryClient();
  const storyQuery = useStory(storyId);
  const setStory = useStoryStore((s) => s.setStory);
  const storyJson = useStoryStore((s) => s.storyJson);

  const autoSaveMutation = useAutoSaveStory(storyId, storyJson);

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

  const [chapterId] = useUrlParam('chapterId');
  const [sceneId] = useUrlParam('sceneId');
  const [dialogId] = useUrlParam('dialogId');

  const dialog = storyJson?.chapters
    .find((chapter) => chapter.id === chapterId)
    ?.scenes.find((scene) => scene.id === sceneId)
    ?.dialogs.find((dialog) => dialog.id === dialogId);

  const _modifyDialog = useStoryStore((s) => s.modifyDialog);
  const modifyDialog = (dialog: Partial<Storyteller.StoryDialog>) => {
    if (!chapterId || !sceneId || !dialogId) return;
    _modifyDialog(chapterId, sceneId, dialogId, dialog);
  };

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

      {storyStats && <StoryStats storyStats={storyStats} />}

      {storyJson && (
        <>
          <StoryNav storyJson={storyJson} />

          <Group align="flex-start">
            <StoryTree storyJson={storyJson} />

            {dialog && (
              <div style={{ flex: 1 }}>
                <StoryViewport dialog={dialog} />
                <EditDialog dialog={dialog} modifyDialog={modifyDialog} />
              </div>
            )}
          </Group>
        </>
      )}
    </Stack>
  );
};

export default StoryEditPage;
