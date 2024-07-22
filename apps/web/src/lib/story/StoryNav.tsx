'use client';
import React, { memo, useEffect } from 'react';
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

  useEffect(() => {
    console.log('chapterId changed', chapterId);
    setSceneId(null, true);
  }, [chapterId]);

  useEffect(() => {
    console.log('sceneId changed', sceneId);
    setDialogId(null, true);
  }, [sceneId]);

  const chapter = storyJson.chapters.find((chapter) => chapter.id === chapterId);
  const scene = chapter?.scenes.find((scene) => scene.id === sceneId);

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
  const addScene = useStoryStore((s) => s.addScene);
  const addDialog = useStoryStore((s) => s.addDialog);

  return (
    <Group>
      <Group align="flex-end" gap="xs">
        <Select
          label="Chapter"
          value={chapterId}
          data={chapters}
          onChange={(v) => setChapterId(v, true)}
          disabled={chapters.length === 0}
          allowDeselect={false}
        />
        <AddStoryPart
          usedNames={chapters.map((c) => c.label)}
          onCreate={(name) => {
            setChapterId(addChapter(name));
          }}
        />
      </Group>

      <Group align="flex-end" gap="xs">
        <Select
          label="Scene"
          value={sceneId}
          data={scenes}
          onChange={(v) => setSceneId(v, true)}
          disabled={!chapterId}
          allowDeselect={false}
        />
        <AddStoryPart
          usedNames={scenes.map((s) => s.label)}
          onCreate={(name) => {
            setSceneId(addScene(chapterId!, name));
          }}
          disabled={!chapterId}
        />
      </Group>

      <Group align="flex-end" gap="xs">
        <Select
          label="Dialog"
          value={dialogId}
          data={dialogs}
          onChange={(v) => setDialogId(v, true)}
          disabled={!sceneId}
          allowDeselect={false}
        />
        <AddStoryPart
          disabled={!chapterId}
          onCreate={(name) => {
            setDialogId(addDialog(chapterId!, sceneId!, name));
          }}
          usedNames={dialogs.map((d) => d.label)}
        />
      </Group>
    </Group>
  );
};

export default memo(StoryNav);
