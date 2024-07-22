'use client';
import React, { memo } from 'react';
import { StoryJson } from '@cerebro/shared';
import { Group, Select } from '@mantine/core';
import { useUrlParam } from '@/utils/hooks/useUrlParam';
import AddStoryPart from '@/lib/story/AddStoryPart';
import { useStoryStore } from '@/app/story/edit/story.store';

type Props = {
  storyJson: StoryJson;
};

const StoryNav = ({ storyJson }: Props) => {
  const [chapterId, setChapterId] = useUrlParam('chapterId');
  const [sceneId, setSceneId] = useUrlParam('sceneId');
  const [dialogId, setDialogId] = useUrlParam('dialogId');

  const chapter = storyJson.chapters.find((chapter) => chapter.id === chapterId);
  const scene = chapter?.scenes.find((scene) => scene.id === sceneId);
  const dialog = scene?.dialogs.find((dialog) => dialog.id === dialogId);

  const chapters = storyJson.chapters.map((chapter) => ({
    value: chapter.id,
    label: chapter.title,
  }));

  const scenes =
    chapter?.scenes.map((scene) => ({
      value: scene.id,
      label: scene.title,
    })) ?? [];

  const dialogs =
    scene?.dialogs.map((dialog) => ({
      value: dialog.id,
      label: dialog.title,
    })) ?? [];

  const addChapter = useStoryStore((s) => s.addChapter);

  return (
    <Group>
      <Group align="flex-end" gap="xs">
        <Select
          label="Chapter"
          value={chapterId}
          data={chapters}
          onChange={(v) => setChapterId(v)}
          disabled={chapters.length === 0}
          allowDeselect={false}
        />
        <AddStoryPart
          usedNames={chapters.map((c) => c.label)}
          onCreate={(name) => {
            const addedChapterId = addChapter(name);
            setChapterId(addedChapterId);
          }}
        />
      </Group>
      <Group align="flex-end" gap="xs">
        <Select
          label="Scene"
          value={sceneId}
          data={scenes}
          onChange={(v) => setSceneId(v)}
          disabled={!chapterId}
          allowDeselect={false}
        />
        <AddStoryPart />
      </Group>
      <Group align="flex-end" gap="xs">
        <Select
          label="Dialog"
          value={dialogId}
          data={dialogs}
          onChange={(v) => setDialogId(v)}
          disabled={!sceneId}
          allowDeselect={false}
        />
        <AddStoryPart />
      </Group>
    </Group>
  );
};

export default memo(StoryNav);
