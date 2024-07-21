'use client';
import React, { memo } from 'react';
import { StoryJson } from '@cerebro/shared';
import { ActionIcon, Group, Select } from '@mantine/core';
import { useUrlParam } from '@/utils/hooks/useUrlParam';
import { Icon } from '@mdi/react';
import { mdiPlus } from '@mdi/js';

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

  return (
    <Group align="flex-end">
      <Select
        label="Chapter"
        value={chapterId}
        data={chapters}
        onChange={(v) => setChapterId(v)}
        disabled={chapters.length === 0}
        allowDeselect={false}
      />
      <ActionIcon size="lg" ml="-8px">
        <Icon path={mdiPlus} size={16} />{' '}
      </ActionIcon>
      <Select
        label="Scene"
        value={sceneId}
        data={scenes}
        onChange={(v) => setSceneId(v)}
        disabled={!chapterId}
        allowDeselect={false}
      />
      <ActionIcon size="lg" ml="-8px" disabled={!chapterId}>
        <Icon path={mdiPlus} size={16} />{' '}
      </ActionIcon>
      <Select
        label="Dialog"
        value={dialogId}
        data={dialogs}
        onChange={(v) => setDialogId(v)}
        disabled={!sceneId}
        allowDeselect={false}
      />
      <ActionIcon size="lg" ml="-8px" disabled={!sceneId}>
        <Icon path={mdiPlus} size={16} />{' '}
      </ActionIcon>
    </Group>
  );
};

export default memo(StoryNav);
