'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useStory } from '@/utils/hooks/useStory';

const StoryPlayPage = () => {
  const searchParams = useSearchParams();
  const storyId = searchParams.get('storyId')!;

  const storyQuery = useStory(storyId);

  return (
    <div>
      Story {storyId}
      <pre>{JSON.stringify(storyQuery.data, null, 2)}</pre>
    </div>
  );
};

export default StoryPlayPage;
