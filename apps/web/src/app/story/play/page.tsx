'use client';
import React, { useEffect } from 'react';
import { useStory } from '@/utils/hooks/useStory';
import { useUrlParam } from '@/utils/hooks/useUrlParam';
import StoryViewport from '@/lib/story/story-viewport/StoryViewport';
import { useSetUrlParams } from '@/utils/hooks/useSetUrlParams';

const StoryPlayPage = () => {
  const setUrlParams = useSetUrlParams();
  const [storyId] = useUrlParam('storyId')!;

  const storyQuery = useStory(storyId);

  const [chapterId, setChapterId] = useUrlParam('chapterId');
  const [sceneId, setSceneId] = useUrlParam('sceneId');
  const [dialogId, setDialogId] = useUrlParam('dialogId');

  const dialog = storyQuery.data?.story.story_json?.chapters
    .find((chapter) => chapter.id === chapterId)
    ?.scenes.find((scene) => scene.id === sceneId)
    ?.dialogs.find((dialog) => dialog.id === dialogId);

  useEffect(() => {
    if (!storyQuery.data?.story.story_json?.startingPoint) return;

    // Get first dialogue
    const { chapterId, sceneId, dialogId } = storyQuery.data.story.story_json.startingPoint;
    setUrlParams({
      chapterId,
      sceneId,
      dialogId,
    });
  }, [storyQuery.data]);

  return (
    <div>
      Story {storyId}
      {storyQuery.data?.story?.story_json && chapterId && sceneId && dialogId && (
        <StoryViewport dialog={dialog} />
      )}
      <pre>{JSON.stringify(storyQuery.data, null, 2)}</pre>
    </div>
  );
};

export default StoryPlayPage;
