'use client';
import React from 'react';
import { useStory } from '@/utils/hooks/useStory';
import { useUrlParam } from '@/utils/hooks/useUrlParam';

const StoryPlayPage = () => {
  const [storyId] = useUrlParam('storyId')!;

  const storyQuery = useStory(storyId);

  return (
    <div>
      Story {storyId}
      <pre>{JSON.stringify(storyQuery.data, null, 2)}</pre>
    </div>
  );
};

export default StoryPlayPage;
