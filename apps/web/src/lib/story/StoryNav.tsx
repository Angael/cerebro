'use client';
import React, { memo, useEffect } from 'react';
import { Storyteller } from '@cerebro/shared';
import { Group, Select } from '@mantine/core';
import { useUrlParam } from '@/utils/hooks/useUrlParam';
import AddStoryPart from '@/lib/story/AddStoryPart';
import { useStoryStore } from '@/app/story/edit/story.store';
import EditStoryPart from '@/lib/story/EditStoryPart';

type Props = {
  storyJson: Storyteller.StoryJson;
};

const StoryNav = ({ storyJson }: Props) => {
  const [chapterId, setChapterId] = useUrlParam('chapterId');
  const [sceneId, setSceneId] = useUrlParam('sceneId');
  const [dialogId, setDialogId] = useUrlParam('dialogId');

  const chapter = storyJson.chapters.find((chapter) => chapter.id === chapterId);
  const scene = chapter?.scenes.find((scene) => scene.id === sceneId);
  const dialog = scene?.dialogs.find((dialog) => dialog.id === dialogId);

  useEffect(() => {
    if (!dialog && dialogId) {
      setDialogId(null);
    }
    if (!scene && sceneId) {
      setSceneId(null);
    }
    if (!chapter && chapterId) {
      setChapterId(null);
    }
  }, [chapterId, sceneId, dialogId, chapter, scene, dialog]);

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

  const setChapterName = useStoryStore((s) => s.setChapterName);
  const setSceneName = useStoryStore((s) => s.setSceneName);
  const setDialogName = useStoryStore((s) => s.setDialogName);

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
        {chapter && (
          <EditStoryPart
            storyPartName={chapter.title}
            usedNames={chapters.map((c) => c.label)}
            onCreate={(name) => {
              setChapterName(chapter.id, name);
            }}
          />
        )}
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
        {scene && (
          <EditStoryPart
            storyPartName={scene.title}
            onCreate={(name) => {
              setSceneName(chapterId!, scene.id, name);
            }}
            usedNames={scenes.map((s) => s.label)}
          />
        )}
        {chapter && (
          <AddStoryPart
            usedNames={scenes.map((s) => s.label)}
            onCreate={(name) => {
              setSceneId(addScene(chapter.id, name));
            }}
          />
        )}
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
        {dialog && (
          <EditStoryPart
            storyPartName={dialogs.find((d) => d.value === dialogId)?.label!}
            onCreate={(name) => {
              setDialogName(chapter!.id, scene!.id, dialog.id, name);
            }}
            usedNames={dialogs.map((d) => d.label)}
          />
        )}
        {scene && (
          <AddStoryPart
            onCreate={(name) => {
              setDialogId(addDialog(chapterId!, sceneId!, name));
            }}
            usedNames={dialogs.map((d) => d.label)}
          />
        )}
      </Group>
    </Group>
  );
};

export default memo(StoryNav);
